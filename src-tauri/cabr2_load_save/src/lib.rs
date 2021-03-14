#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]

mod error;
mod handler;
mod types;

mod beryllium;
mod cabr2;
mod pdf;

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
