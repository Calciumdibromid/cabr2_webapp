#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]

mod error;
mod handler;
mod types;

mod beryllium;
mod cabr2;
mod pdf;

use std::{convert::Infallible, fs, path::PathBuf};

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;
use warp::{hyper::StatusCode, Reply};

use types::CaBr2Document;

pub const DOWNLOAD_FOLDER: &str = "/tmp/cabr2_server/created";
pub const CACHE_FOLDER: &str = "/tmp/cabr2_server/cache";

pub struct LoadSave;

impl LoadSave {
  pub fn new() -> LoadSave {
    let mut loaders = handler::REGISTERED_LOADERS.lock().unwrap();
    loaders.insert("cb2", Box::new(cabr2::CaBr2));
    loaders.insert("be", Box::new(beryllium::Beryllium));

    let mut savers = handler::REGISTERED_SAVERS.lock().unwrap();
    savers.insert("cb2", Box::new(cabr2::CaBr2));
    savers.insert("pdf", Box::new(pdf::PDF));

    LoadSave
  }
}

pub async fn handle_available_document_types() -> Result<impl Reply, Infallible> {
  match handler::get_available_document_types() {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadDocumentBody {
  file_type: String,
  document: String,
}

pub async fn handle_load_document(body: LoadDocumentBody) -> Result<impl Reply, Infallible> {
  lazy_static! {
    static ref TMP: PathBuf = PathBuf::from(CACHE_FOLDER);
  }

  let mut path;
  loop {
    path = TMP.clone();
    path.push(&serde_json::to_string(&Uuid::new_v4()).unwrap().replace('"', ""));
    let path = path.with_extension(&body.file_type);

    if !path.exists() {
      break;
    }
  }

  let reply = match fs::write(&path, body.document) {
    Ok(_) => match handler::load_document(path.clone()) {
      Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
      Err(err) => Ok(warp::reply::with_status(
        warp::reply::json(&Value::String(err.to_string())),
        StatusCode::BAD_REQUEST,
      )),
    },
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::INTERNAL_SERVER_ERROR,
    )),
  };

  fs::remove_file(&path).unwrap_or_else(|err| log::error!("removing file '{:?}' failed: {}", path, err.to_string()));

  reply
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveDocumentBody {
  file_type: String,
  document: CaBr2Document,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SaveDocumentResponse {
  download_url: String,
}

pub async fn handle_save_document(body: SaveDocumentBody) -> Result<impl Reply, Infallible> {
  lazy_static! {
    static ref TMP: PathBuf = PathBuf::from(DOWNLOAD_FOLDER);
  }

  let mut path;
  let mut uuid_str;
  loop {
    path = TMP.clone();
    uuid_str = serde_json::to_string(&Uuid::new_v4()).unwrap().replace('"', "");
    path.push(&uuid_str);
    let path = path.with_extension(&body.file_type);

    if !path.exists() {
      break;
    }
  }

  match handler::save_document(body.file_type.clone(), path, body.document) {
    Ok(_) => Ok(warp::reply::with_status(
      warp::reply::json(&SaveDocumentResponse {
        #[cfg(not(debug_assertions))]
        download_url: format!("https://api.cabr2.de/download/{}.{}", uuid_str, body.file_type),
        #[cfg(debug_assertions)]
        download_url: format!("http://localhost:3030/download/{}.{}", uuid_str, body.file_type),
      }),
      StatusCode::CREATED,
    )),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}
