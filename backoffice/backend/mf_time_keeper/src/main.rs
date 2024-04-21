use actix_web::{web, App, HttpResponse, HttpServer, Responder, post, get};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use diesel::pg::PgConnection;
use serde::{Deserialize, Serialize};
use dotenv::dotenv;
use std::env;

#[derive(Serialize, Deserialize)]
struct Version {
    version: String,
}

type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

#[post("/api/version")]
async fn post_version(pool: web::Data<DbPool>, version_data: web::Json<Version>) -> impl Responder {
    use crate::schema::versions::dsl::*; 

    let new_version = version_data.into_inner();
    let conn = pool.get().expect("couldn't get db connection from pool");

    let result = diesel::insert_into(versions)
        .values(version = new_version.version) // Changed from &new_version.version
        .execute(&conn);

    match result {
        Ok(_) => HttpResponse::Ok().json("Version added"),
        Err(_) => HttpResponse::InternalServerError().json("Error adding version"),
    }
}

#[get("/api/version")]
async fn get_version(pool: web::Data<DbPool>) -> impl Responder {
    use crate::schema::versions::dsl::*;
    let conn = pool.get().expect("couldn't get db connection from pool");

    let result = versions
        .order(id.desc())
        .first::<Version>(&conn);

    match result {
        Ok(version) => HttpResponse::Ok().json(version),
        Err(_) => HttpResponse::InternalServerError().json("Error fetching version"),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(post_version)
            .service(get_version)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
