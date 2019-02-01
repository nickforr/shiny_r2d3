


createFunnelData <- function(sigma = 0.1) {
  fls <- 
    simplyr::createRandomReturns(0.01, sigma, 1000, 20) %>%
    simplyr::convertReturnToIndex() * 100
  
  flSummary <- simplyr::calcStatQuantiles(fls)
  
  flSample <- 
    fls[, sample(seq_len(1000), 200)] %>%
    simplyr::tidySimData()
  
  jsonlite::toJSON(list(flSummary = flSummary, flSample = flSample))
}

translateFunnelData <- function(fls) {
  flSummary <- simplyr::calcStatQuantiles(fls)
  
  flSample <- 
    fls[, sample(seq_len(1000), 200)] %>%
    simplyr::tidySimData()
  
  jsonlite::toJSON(list(flSummary = flSummary, flSample = flSample))
}

