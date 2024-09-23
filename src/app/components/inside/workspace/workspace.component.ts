import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
// import { Router } from '@angular/router';
// import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css',
})
export class WorkspaceComponent implements OnInit {
  constructor(
    private authService: AuthService,
    // private router: Router,
    // private dataService: DataService
  ) {}

  ngOnInit() {
    // this.fetchData();
  }

  // async fetchData() {
  //   const data = await this.dataService.getAllData('');
  //   console.log(data);
  // }

  logout() {
    this.authService.logout();
  }
}
