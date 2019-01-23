
library(shiny)
library(tibble)
library(r2d3)

ui <- fluidPage(
  inputPanel(
    sliderInput("x_mean", label = "x mean:",
                min = 0, max = 10, value = 1, step = 1),
    sliderInput("y_mean", label = "y mean:",
                min = 0, max = 10, value = 1, step = 1)
  ),
  d3Output("d3")
)

server <- function(input, output) {
  
  randomData <- reactive({
    tibble::tibble(
      x = rnorm(1000, input$x_mean, 5), 
      y = rnorm(1000, input$y_mean, 5)
    )
  })
  
  output$d3 <- renderD3({
    r2d3(
      randomData(),
      #script = "axes.js"
      script = "scatter.js"
    )
  })
}

shinyApp(ui = ui, server = server)
