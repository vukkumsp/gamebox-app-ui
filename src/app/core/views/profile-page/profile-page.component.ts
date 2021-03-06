import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LOCALUSERS } from './../../../../assets/LOCALUSERS';
import { UserModel } from '../../models/user-model';
import { FirebaseService } from '../../services/firebase.service';
import { NavigationService } from '../../services/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { UserDBService } from '../../services/userdb.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  user: UserModel;
  editDisplayNameFlag: boolean;
  editEmailFlag: boolean;
  editUsernameFlag: boolean;

  loginSubscription: Subscription;

  constructor(private navigation: NavigationService,
              private router: Router,
              private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginSubscription = this.loginService.getCurrentUserDetails().subscribe((user)=>{
      this.user = user;
    });
    this.editDisplayNameFlag = false;
    this.editEmailFlag = false;
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  openLogin() {
    this.router.navigateByUrl('login');
  }

  back(){
    this.navigation.back();
  }

  editDisplayName(){
    this.editDisplayNameFlag = true;
  }

  saveDisplayName(){
    this.editDisplayNameFlag = false;
    this.loginService.updateUser(this.user);
  }

  uploadImg(){
    //upload the image to firebase cloud
    //get image's url
    this.user.photoURL = LOCALUSERS.photoURL;
    //update the image url to user profile
    this.loginService.updateUser(this.user);
  }

  editUsername(){
    this.editUsernameFlag = true;
  }

  saveUsername(){
    this.editUsernameFlag = false;
    this.loginService.updateUser(this.user);
  }
}
