use warp::Filter;

#[cfg(debug_assertions)]
const ADDRESS: ([u8; 4], u16) = ([127, 0, 0, 1], 3030);

#[cfg(not(debug_assertions))]
const ADDRESS: ([u8; 4], u16) = ([0, 0, 0, 0], 80);

#[tokio::main]
async fn main() {
  // must be initialized first
  let _logger = cabr2_logger::Logger::new();

  let _config = cabr2_config::Config;
  let _load_save = cabr2_load_save::LoadSave::new();
  let _search = cabr2_search::Search::new();

  log::info!("server starting...");

  // GET /hello/warp => 200 OK with body "Hello, warp!"
  let hello = warp::path!("hello" / String).map(|name| format!("Hello, {}!", name));

  let api = warp::path("api").and(warp::path("v1"));

  let search = api.and(warp::path("search"));
  let search_paths = search
    .and(warp::path("suggestions"))
    .and(warp::post())
    .and(warp::body::json())
    .and_then(cabr2_search::handle_suggestions)
    .with(warp::cors().allow_any_origin())
    .or(
      search
        .and(warp::path("results"))
        .and(warp::path::end())
        .and(warp::post())
        .and(warp::body::json())
        .and_then(cabr2_search::handle_results),
    )
    .or(
      search
        .and(warp::path("substances"))
        .and(warp::path::end())
        .and(warp::post())
        .and(warp::body::json())
        .and_then(cabr2_search::handle_substances),
    );

  let routes = search_paths.with(
    warp::cors()
      .allow_origin("http://localhost:4200")
      .allow_methods(vec!["POST"]),
  );
  // allow cors on everything
  // let routes = routes.with(warp::cors().allow_any_origin());

  // log::debug!("{:?}", routes);

  // On debug builds it runs on `http://localhost:3030`,
  // on release builds it runs on port 80 and listens on every interface.
  warp::serve(routes).run(ADDRESS).await;
}
