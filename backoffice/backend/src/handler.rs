use crate::{
    model::{AppState, MfVersion, UpdateMfVersion},
    response::{GenericResponse, MfVersionData, MfVersionListResponse},
};
use actix_web::{delete, get, patch, post, web, HttpResponse, Responder};
use chrono::prelude::*;
use uuid::Uuid;


#[get("/api/version/{app_name}")]
pub async fn get_latest_mf_version(
    data: web::Data<AppState>,
    app_name: web::Path<String>
) -> impl Responder {
    let time_keeper_db = data.time_keeper_db.lock().unwrap();
    let mf_version = time_keeper_db.clone();
    let response = if let Some(last_version) = mf_version
        .iter()
        .filter(|version| version.appName == app_name.to_string())
        .max_by_key(|version| &version.version)
    {
        MfVersionData {
            mf_version: last_version.clone(),
        }
    } else {
        MfVersionData {
            mf_version: MfVersion {
                version: "".to_string(),
                appName: "".to_string(),
            },
        }
    };
    HttpResponse::Ok().json(response)
}

#[get("/api/versions/{app_name}")]
pub async fn get_all_mf_versions(
    data: web::Data<AppState>,
    app_name: web::Path<String>
) -> impl Responder {
    let time_keeper_db = data.time_keeper_db.lock().unwrap();
    let versions_for_app = time_keeper_db
        .iter()
        .filter(|version| version.appName == *app_name)
        .cloned()
        .collect::<Vec<MfVersion>>();

    if versions_for_app.is_empty() {
        return HttpResponse::NotFound().json("No versions found for the specified app");
    }

    let response = MfVersionListResponse { mf_versions: versions_for_app };
    HttpResponse::Ok().json(response)
}

#[get("/api/versions")]
pub async fn abc(
    data: web::Data<AppState>
) -> impl Responder {
    let response =
        MfVersionData {
            mf_version: MfVersion {
                version: "http://localhost:4173/assets/1714927623569_remoteEntry.js".to_string(),
                appName: "http://localhost:4173/assets/1714927623569_remoteEntry.js".to_string(),
            },
        };
    HttpResponse::Ok().json(response)
}

#[post("/api/version")]
pub async fn create_mf_version(
    data: web::Data<AppState>,
    new_mf_version: web::Json<UpdateMfVersion>,
) -> impl Responder {
    let mut time_keeper_db = data.time_keeper_db.lock().unwrap();
    let new_mf_version = MfVersion {
        version: new_mf_version.version.clone(),
        appName: new_mf_version.appName.clone(),
    };
    time_keeper_db.push(new_mf_version.clone());
    let response = GenericResponse {
        status: "success".to_string(),
        message: "New version added".to_string(),
    };
    HttpResponse::Ok().json(response)
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(get_latest_mf_version);
    cfg.service(get_all_mf_versions);
    cfg.service(abc);
    cfg.service(create_mf_version);
}