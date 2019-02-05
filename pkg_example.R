
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
source("createFunnelData.R")

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
          value = 100, step = 5)#,
        # sliderInput(
        #   inputId = "flmax", "Max fl on funnel", min = 100, max = 200, 
        #   value = 120, step = 5)
        ), 
      mainPanel(
        tabsetPanel(
          tabPanel(
            "FL Lines", 
            fluidPage(
              d3Output("d3_lines")
            )
          ), 
          tabPanel(
            "Prob. success", 
            fluidPage(d3Output("d3_col"))
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
  output$d3_lines <- renderD3({
    r2d3(
      translateFunnelData(flProjections()),
      script = "funnelPlot.js", 
      options = list(fl_max = 120)
    )
  })
  output$d3_col <- renderD3({
    barData <- 
      tibble::tibble(
        x = probSuccess()$timestep, 
        y = probSuccess()$probSuccess * 100, 
        yorig = (seq_len(nproj + 1) - 1) * 100 / (nproj),
        label = probSuccess()$timestep,
        ylabel = sprintf("%.f%%", probSuccess()$probSuccess * 100)
      )
    r2d3(
      barData,
      script = "prob_col_comparison.js", 
      options = list(show_initial = FALSE)
    )
  })
}

shinyApp(ui = ui, server = server)
