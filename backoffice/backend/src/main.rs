mod handler;
mod model;
mod response;

use actix_web::http::header;
use actix_web::middleware::Logger;
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde::Serialize;
use actix_cors::Cors;
use model::AppState;


#[derive(Serialize)]
pub struct GenericResponse {
    pub status: String,
    pub message: String
}

#[get("/api/health")]
async fn health_checker_handler() -> impl Responder {
    const MESSAGE: &str = "alive";

    let response_json = &GenericResponse {
        status: "success".to_string(),
        message: MESSAGE.to_string()
    };

    HttpResponse::Ok().json(response_json)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }
    env_logger::init();

    let app_state = AppState::init();
    let app_data = web::Data::new(app_state);

    println!("Starting server at http://127.0.0.1:8000");
    
    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://localhost:3000/")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCEPT,
            ])
            .supports_credentials();

        App::new()
            .app_data(app_data.clone())
            .configure(handler::configure)
            .wrap(cors)
            .service(health_checker_handler)
            .wrap(Logger::default())
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await
}
