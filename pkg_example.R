
library(shiny)
library(tibble)
library(r2d3)

ui <- 
  fluidPage(
  tabsetPanel(
    tabPanel(
      "Scatter", 
      fluidPage(
        column(
          width = 12,
          inputPanel(
            sliderInput("x_mean", label = "x mean:",
                        min = 0, max = 50, value = 1, step = 1),
            sliderInput("y_mean", label = "y mean:",
                        min = 0, max = 50, value = 1, step = 1)
          )
        ),
        column(
          width = 12,
          d3Output("d3_scatter")  
        )
      )
    ), 
    tabPanel(
      "Bar", 
      fluidPage(
        column(
          width = 12,
          inputPanel(
            sliderInput(
              "bar_max", label = "bar max",
              min = 0, max = 100, value = 90, step = 5)
          )
        ),
        column(
          width = 12,
          d3Output("d3_bar")  
        )
      )
    )
  )
)

server <- function(input, output) {
  
  scatterData <- reactive({
    tibble::tibble(
      x = c(0, rnorm(100, input$x_mean, 5)), 
      y = c(0, rnorm(100, input$y_mean, 5))
    )
  })
  barData <- reactive({
    tibble::tibble(
      x = seq_len(10) - 1, 
      y = runif(10, max = input$bar_max / 100)
    )
  })
  
  output$d3_scatter <- renderD3({
    r2d3(
      scatterData(),
      script = "scatter.js"
    )
  })
  output$d3_bar <- renderD3({
    r2d3(
      barData(),
      script = "prob_bar.js"
    )
  })
}

shinyApp(ui = ui, server = server)
