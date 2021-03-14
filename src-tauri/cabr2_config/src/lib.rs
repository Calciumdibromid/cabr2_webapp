mod error;
mod handler;
mod types;

pub use handler::{get_hazard_symbols, read_config, write_config, DATA_DIR, PROJECT_DIRS, TMP_DIR};
pub use types::{BackendConfig, GHSSymbols};

pub struct Config;
