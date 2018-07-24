import { Component } from "@angular/core";
import { HomeComponent } from "./home/home.component";

// import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "Capital dos Candidatos";
  // private router: Router

  constructor() {}

  // openAbout() {
  //   this.router.navigate(["/sobre"]);
  // }
}

export class matToolbarRow {}
