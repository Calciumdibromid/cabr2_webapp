use warp::Filter;

#[tokio::main]
async fn main() {
  // must be initialized first
  let _logger = cabr2_logger::Logger::new();

  let _config = cabr2_config::Config;
  let _load_save = cabr2_load_save::LoadSave::new();
  let _search = cabr2_search::Search::new();

  let search_suggestions = warp::path("suggestions")
    .and(warp::post())
    .and(warp::body::json())
    .and_then(cabr2_search::handle_suggestions);

  let search_results = warp::path("results")
    .and(warp::path::end())
    .and(warp::post())
    .and(warp::body::json())
    .and_then(cabr2_search::handle_results);

  let search_substances = warp::path("substances")
    .and(warp::path::end())
    .and(warp::post())
    .and(warp::body::json())
    .and_then(cabr2_search::handle_substances);

  let search = warp::path("search")
    .and(search_suggestions)
    .or(search_results)
    .or(search_substances);

  let config_programversion = warp::path("programversion")
    .and(warp::path::end())
    .and(warp::get())
    .and_then(cabr2_config::handle_program_version);

  let config_hazardSymbols = warp::path("hazardSymbols")
    .and(warp::path::end())
    .and(warp::get())
    .and_then(cabr2_config::handle_hazardSymbols);

  let config_promptHtml = warp::path("promptHtml")
    .and(warp::path::end())
    .and(warp::post())
    .and(warp::body::json())
    .and_then(cabr2_config::handle_promptHtml);

  let config = warp::path("config")
    .and(config_programversion)
    .or(config_hazardSymbols)
    .or(config_promptHtml);

  let cors;
  let address;
  #[cfg(not(debug_assertions))]
  {
    cors = warp::cors()
      .allow_origin("http://app.cabr2.de")
      .allow_methods(vec!["GET", "POST"])
      .allow_headers(vec!["content-type"]);
    address = ([0, 0, 0, 0], 80);
  }
  #[cfg(debug_assertions)]
  {
    cors = warp::cors()
      .allow_origin("http://localhost:4200")
      .allow_methods(vec!["GET", "POST"])
      .allow_headers(vec!["content-type"]);
    address = ([127, 0, 0, 1], 3030);
  }

  let api = warp::path("api").and(warp::path("v1"));
  let routes = api.and(search).or(config).with(cors);

  // allow cors on everything
  // let routes = routes.with(warp::cors().allow_any_origin());

  // log::debug!("{:?}", routes);

  log::info!("server starting...");
  // On debug builds it runs on `http://localhost:3030`,
  // on release builds it runs on port 80 and listens on every interface.
  warp::serve(routes).run(address).await;
}
