import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit {
  lists: any[] = [];
  boardId: string | null = null;
  editTitle: any = {};
  editCard: any = {};
  boardInfo: any = null;
  titleChanged = false;

  listCards: any = {};
  addUserEmail = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id');
    if (this.boardId) {
      // Load general board information
      const board = await this.dataService.getBoardInfo(this.boardId);
      this.boardInfo = board.data;

      // Retrieve all lists
      this.lists = await this.dataService.getBoardLists(this.boardId);

      // Retrieve cards for each list.
      for (let list of this.lists) {
        this.listCards[list.id] = await this.dataService.getListCards(list.id);
      }

      // For later...
      this.handleRealtimeUpdates();
    }
  }

  //
  // BOARD logic
  //
  async saveBoardTitle() {
    await this.dataService.updateBoard(this.boardInfo);
    this.titleChanged = false;
  }

  async deleteBoard() {
    await this.dataService.deleteBoard(this.boardInfo);
    this.router.navigateByUrl('/workspace');
  }

  //
  // LISTS logic
  //
  async addList() {
    const newList = await this.dataService.addBoardList(
      this.boardId!,
      this.lists.length
    );
  }

  editingTitle(list: any, edit = false) {
    this.editTitle[list.id] = edit;
  }

  async updateListTitle(list: any) {
    await this.dataService.updateBoardList(list);
    this.editingTitle(list, false);
  }

  async deleteBoardList(list: any) {
    await this.dataService.deleteBoardList(list);
  }

  //
  // CARDS logic
  //
  async addCard(list: any) {
    await this.dataService.addListCard(
      list.id,
      this.boardId!,
      this.listCards[list.id].length
    );
  }

  editingCard(card: any, edit = false) {
    this.editCard[card.id] = edit;
  }

  async updateCard(card: any) {
    await this.dataService.updateCard(card);
    this.editingCard(card, false);
  }

  async deleteCard(card: any) {
    await this.dataService.deleteCard(card);
  }

  // Invites
  async addUser() {
    await this.dataService.addUserToBoard(this.boardId!, this.addUserEmail);
    this.addUserEmail = '';
  }

  handleRealtimeUpdates() {
    this.dataService.getTableChanges().subscribe((update: any) => {
      const record = update.new?.id ? update.new : update.old;
      const event = update.eventType;

      if (!record) return;

      if (update.table == 'cards') {
        if (event === 'INSERT') {
          this.listCards[record.list_id].push(record);
        } else if (event === 'UPDATE') {
          const newArr = [];

          for (let card of this.listCards[record.list_id]) {
            if (card.id == record.id) {
              card = record;
            }
            newArr.push(card);
          }
          this.listCards[record.list_id] = newArr;
        } else if (event === 'DELETE') {
          this.listCards[record.list_id] = this.listCards[
            record.list_id
          ].filter((card: any) => card.id !== record.id);
        }
      } else if (update.table == 'lists') {
        if (event === 'INSERT') {
          this.lists.push(record);
          this.listCards[record.id] = [];
        } else if (event === 'UPDATE') {
          this.lists.filter((list: any) => list.id === record.id)[0] = record;

          const newArr = [];

          for (let list of this.lists) {
            if (list.id == record.id) {
              list = record;
            }
            newArr.push(list);
          }
          this.lists = newArr;
        } else if (event === 'DELETE') {
          this.lists = this.lists.filter((list: any) => list.id !== record.id);
        }
      }
    });
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === '27') {
      // Close whatever needs to be closed!
      this.titleChanged = false;

      Object.keys(this.editCard).map((item) => {
        this.editCard[item] = false;
        return item;
      });

      Object.keys(this.editTitle).map((item) => {
        this.editTitle[item] = false;
        return item;
      });
    }
  }
}
