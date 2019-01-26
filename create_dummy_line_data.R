


create_dummy_line_data <- function(n, sigma) {
  
  tt <- 15
  ref <- paste0("ref_", purrr::flatten_dbl(purrr::map(seq_len(n), ~rep.int(.x, 15))))
  x <- rep.int(seq_len(tt), n)
  y <- purrr::flatten_dbl(purrr::map(seq_len(n), ~0.7 * cumprod(1 + rnorm(tt, 0.02, sigma))))
  tibble::tibble(
    ref = ref, 
    x = x, 
    y = y
  )
}