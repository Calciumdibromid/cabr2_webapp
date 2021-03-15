mod error;
mod handler;
mod types;

use std::convert::Infallible;

use handler::get_localized_strings;
pub use handler::{get_hazard_symbols, read_config, write_config, DATA_DIR, PROJECT_DIRS, TMP_DIR};
pub use types::{BackendConfig, GHSSymbols};

use serde::Deserialize;
use serde_json::Value;
use warp::{hyper::StatusCode, Reply};

pub struct Config;

pub async fn handle_hazardSymbols() -> Result<impl Reply, Infallible> {
  match handler::get_hazard_symbols() {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}

pub async fn handle_program_version() -> Result<impl Reply, Infallible> {
  Ok(warp::reply::with_status(
    warp::reply::json(&env!("CARGO_PKG_VERSION")),
    StatusCode::OK,
  ))
}

#[derive(Debug, Deserialize)]
pub struct PromptHtmlBody {
  name: String,
}

pub async fn handle_promptHtml(body: PromptHtmlBody) -> Result<impl Reply, Infallible> {
  match handler::get_prompt_html(body.name) {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}

pub async fn handle_availableLanguages() -> Result<impl Reply, Infallible> {
  match handler::get_available_languages() {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}

#[derive(Debug, Deserialize)]
pub struct LocalizedStringsBody {
  language: String,
}

pub async fn handle_localizedStrings(body: LocalizedStringsBody) -> Result<impl Reply, Infallible> {
  match handler::get_localized_strings(body.language) {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}
