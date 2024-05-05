use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[allow(non_snake_case)]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MfVersion {
    pub version: String,
    pub appName: String,
}

pub struct AppState {
    pub time_keeper_db: Arc<Mutex<Vec<MfVersion>>>,
}

impl AppState {
    pub fn init() -> AppState {
        AppState {
            time_keeper_db: Arc::new(Mutex::new(Vec::new())),
        }
    }
}

#[derive(Debug, Deserialize)]
#[allow(non_snake_case)]
pub struct UpdateMfVersion {
    pub version: String,
    pub appName: String,
}

