import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { AsyncPipe } from '@angular/common';
import { GravatarModule } from 'ngx-gravatar';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [MatButtonModule, RouterLink, AsyncPipe, GravatarModule],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css',
})
export class WorkspaceComponent implements OnInit {
  boards: any = [];
  auth = inject(AuthService);
  user = this.auth.currentUser;

  constructor(private dataService: DataService, private router: Router) {}

  async ngOnInit() {
    this.boards = await this.dataService.getBoards();
  }

  async startBoard() {
    await this.dataService.startBoard();
    this.boards = await this.dataService.getBoards();

    if (this.boards.length > 0) {
      const newBoard = this.boards.pop();

      if (newBoard.boards) {
        this.router.navigateByUrl(`/workspace/${newBoard.boards.id}`);
      }
    }
  }

  logout() {
    this.auth.logout();
  }
}
