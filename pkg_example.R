
library(shiny)
library(tibble)
library(r2d3)

ui <- fluidPage(
  column(width = 12,
    inputPanel(
      sliderInput("x_mean", label = "x mean:",
                  min = 0, max = 50, value = 1, step = 1),
      sliderInput("y_mean", label = "y mean:",
                  min = 0, max = 50, value = 1, step = 1)
    )
  ),
  column(width = 12,
    d3Output("d3")  
  )
)

server <- function(input, output) {
  
  randomData <- reactive({
    tibble::tibble(
      x = c(0, rnorm(100, input$x_mean, 5)), 
      y = c(0, rnorm(100, input$y_mean, 5))
    )
  })
  
  output$d3 <- renderD3({
    r2d3(
      randomData(),
      #script = "test2.js",
      script = "scatter.js"
    )
  })
}

shinyApp(ui = ui, server = server)
