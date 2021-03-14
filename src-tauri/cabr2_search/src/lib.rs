#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]

mod error;
mod handler;
mod types;

mod gestis;

pub struct Search;

impl Search {
  pub fn new() -> Search {
    let mut providers = handler::REGISTERED_PROVIDERS.lock().unwrap();
    providers.insert("gestis", Box::new(gestis::Gestis::new()));

    Search
  }
}
