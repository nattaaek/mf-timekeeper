use serde::Serialize;

use crate::model::MfVersion;

#[derive(Serialize)]
pub struct GenericResponse {
    pub status: String,
    pub message: String,
}

#[derive(Serialize, Debug)]
pub struct MfVersionData {
    pub mf_version: MfVersion,
}

#[derive(Serialize, Debug)]
pub struct LatestMfVersionResponse {
    pub data: MfVersionData,
}

#[derive(Serialize, Debug)]
pub struct MfVersionListResponse {
    pub mf_versions: Vec<MfVersion>,
}
