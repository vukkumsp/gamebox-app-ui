import { stringify } from '@angular/compiler/src/util';
import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { GAMEBOXCONFIG, CATEGORIES_LIST } from 'src/assets/GAMEBOXCONFIG';
import { CategoryModel } from '../../models/category-model';
import { UserModel } from '../../models/user-model';
import { FirebaseService } from '../../services/firebase.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  appName: string;
  languages: any[];
  categories: CategoryModel[];

  isOnline: boolean;
  loggedIn: boolean;
  user: UserModel;

  constructor(private router: Router,
    private firebaseService: FirebaseService) {
    this.appName = GAMEBOXCONFIG.APPNAME;
    this.languages = GAMEBOXCONFIG.LANGUAGES;
    this.categories = CATEGORIES_LIST;

    this.isOnline = false;
    this.loggedIn = false;

    if (localStorage.getItem("user")) {
      //on reload of page, loggedin user is logged out
      localStorage.removeItem("user");
    }

    // let timer = setInterval(() => {
    //   if(localStorage.getItem("user")){
    //     this.loggedIn = true;
    //     this.user = JSON.parse(localStorage.getItem("user"));
    //     clearInterval(timer);
    //   }
    // }, 500);
    this.startIsLoggedInTimer();
  }

  ngOnInit(): void { }

  startIsLoggedInTimer(){
    let timer = setInterval(()=>{
      if(localStorage.getItem("user")){
        this.loggedIn = true;
        this.user = JSON.parse(localStorage.getItem("user"));
        this.startIsLoggedOutTimer();
        clearInterval(timer);
      }
    }, 500)
  }

  startIsLoggedOutTimer(){
    let timer = setInterval(()=>{
      if(localStorage.getItem("user")==null){
        this.loggedIn = false;
        this.user = JSON.parse(localStorage.getItem("user"));
        this.startIsLoggedInTimer();
        clearInterval(timer);
      }
    }, 500)
  }

  openCategory(category_value: string): void {
    // below is required so incase the route navigates
    // is to the same url but with different :id
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigateByUrl("category/" + category_value);
  }

  goToHome() {
    this.router.navigateByUrl("home");
  }

  goToScoreBoard() {
    this.router.navigateByUrl("scoreBoard");
  }

  goToProfilePage() {
    this.router.navigateByUrl("profilePage");
  }

  openLogin() {
    this.router.navigateByUrl('login');
  }

  logout() {
    this.firebaseService.logout();
    this.loggedIn = false;
    this.goToHome();
  }

  toggle() {
    if (this.isOnline) {
      document.getElementById("online").style.color = "yellow";
      document.getElementById("offline").style.color = "white";
    }
    else {
      document.getElementById("online").style.color = "white";
      document.getElementById("offline").style.color = "yellow";
    }
  }
}
