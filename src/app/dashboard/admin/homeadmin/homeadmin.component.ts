import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";

@Component({
  selector: "app-homeadmin",
  templateUrl: "./homeadmin.component.html",
  styleUrls: ["./homeadmin.component.css"],
})
export class HomeadminComponent implements OnInit {
  constructor() {}

  myChart: Chart;
  myChart2:Chart;
  ngOnInit(): void {
    this.llenargraficos();
  }

  llenargraficos() {
    const ctx: any = document.getElementById("grafico1");
    console.log(ctx);

    if (this.myChart) {
      this.myChart.destroy();
    }
    this.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["david", "diego"],
        datasets: [
          {
            label: "Cantidad",
            data: [1, 2],
            backgroundColor: ["rgba(54, 162, 235)", "rgba(201, 203, 207)"],
            hoverBackgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            borderWidth: 1,
          },
        ],
      },
    });

    const ctx2: any = document.getElementById('grafico2');
    
        if (this.myChart2) {
          this.myChart.destroy();
        }
        this.myChart2 = new Chart(ctx2, {
          type: "pie",
          data: {
            labels: [
              "david",
              "diego"
            ],
            datasets: [
              {
                label: "Cantidad",
                data: [
                  1,2
                ],
                backgroundColor: [
                  "rgba(54, 162, 235)",
                  "rgba(201, 203, 207)",
                  
                ],
                hoverBackgroundColor: [
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(201, 203, 207, 0.2)",
                  
                ],
                borderWidth: 1,
              },
            ],
          }
        });
  }
}
