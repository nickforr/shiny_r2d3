
library(shiny)
library(shinythemes)
library(simplyr)
library(tibble)
library(r2d3)

set.seed(1.357)
nproj <- 15
nsim <- 5000
sampleSims <- sample.int(nsim, floor(0.1 * nsim))
highRiskRtns <- 
  simplyr::createRandomReturns(
    mu = 0.05, sigma = 0.15, nsim = 5000, nproj = nproj)
lbpRtns <- 
  simplyr::createRandomReturns(
    mu = 0.02, sigma = 0.03, nsim = 5000, nproj = nproj)


ui <- 
  fluidPage(
    theme = shinytheme("flatly"),
    title = "D3 test",
    sidebarLayout(
      sidebarPanel(
        numericInput(
          inputId = "liabValue", label = "Liab. value (m)", value = 200, 
          min = 0, max = 10000),
        sliderInput(
          inputId = "fl", label = "initial f.l.", min = 50, max = 100, 
          value = 70, step = 1), 
        sliderInput(
          inputId = "ppnRisky", label = "Ppn. risky", min = 0, max = 100, 
          value = 50, step = 5), 
        sliderInput(
          inputId = "flTarget", label = "Target f.l.", min = 80, max = 120, 
          value = 100, step = 5),
        selectInput(
          inputId = "flYear", "Scatter f.l. year", 
          choices = seq_len(nproj), selected = nproj), 
        selectInput(
          inputId = "riskYear", "Scatter f.l. year", 
          choices = seq_len(nproj), selected = nproj)
        ), 
      mainPanel(
        tabsetPanel(
          tabPanel(
            "Scatter", 
            fluidPage(
              d3Output("d3_scatter")
            )
          ), 
          tabPanel(
            "Prob. bar", 
            fluidPage(d3Output("d3_bar"))
          ), 
          tabPanel(
            "FL Lines", 
            fluidPage(
              d3Output("d3_lines")
            )
          )
        )
      )
    )
  )

server <- function(input, output) {
  
  assetRtns <- reactive({
    (input$ppnRisky / 100) * highRiskRtns + 
      (1 - input$ppnRisky / 100) * lbpRtns
  })
  assetValues <- reactive({
    input$fl * input$liabValue * simplyr::convertReturnToIndex(assetRtns())
  })
  
  liabValues <- reactive({
    input$liabValue * simplyr::convertReturnToIndex(lbpRtns)
  })
  
  flProjections <- reactive({
    assetValues() / liabValues()
  })
  deficitProjections <- reactive({
    assetValues() - liabValues()
  })
  
  probSuccess <- reactive({
    simplyr::calcStatProbSuccess(flProjections(), probTarget = input$flTarget)
  })
  
  output$d3_scatter <- renderD3({
    flPoints <- flProjections()[as.numeric(input$flYear) + 1, ]
    deficitPoints <- deficitProjections()[as.numeric(input$riskYear) + 1, ]
      
    scatterData <- 
      tibble::tibble(
        x = deficitPoints, 
        y = flPoints
      )
    r2d3(
      scatterData,
      script = "scatter.js"
    )
  })
  output$d3_bar <- renderD3({
    barData <- 
      tibble::tibble(
        x = probSuccess()$timestep, 
        y = probSuccess()$probSuccess
      )
    r2d3(
      barData,
      script = "prob_bar.js"
    )
  })
  output$d3_lines <- renderD3({
    sampleData <- flProjections()[, sampleSims, drop = FALSE]
    lineData <- 
      tibble::tibble(
        ref = 
          paste0(
            "ref_", 
            unlist(lapply(seq_len(ncol(sampleData)), rep.int, times = nproj + 1))), 
        xval = rep.int(seq_len(nproj + 1) - 1, ncol(sampleData)),
        yval = as.vector(sampleData)
      )
      flProjections()
    r2d3(
      lineData,
      script = "line.js"
    )
  })
}

shinyApp(ui = ui, server = server)
