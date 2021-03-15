#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]

mod error;
mod handler;
mod types;

mod beryllium;
mod cabr2;
mod pdf;

use std::convert::Infallible;

// use serde::Deserialize;
use serde_json::Value;
use warp::{hyper::StatusCode, Reply};

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

pub async fn handle_availableDocumentTypes() -> Result<impl Reply, Infallible> {
  match handler::get_available_document_types() {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}
