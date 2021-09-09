import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LOCALUSERS } from 'src/assets/LOCALUSERS';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  isLoggedIn: boolean = false;
  // loggedInUser: UserModel;
  loggedInUser: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null);

  constructor(private firebaseAuth: AngularFireAuth) { }

  async signIn(email: string, password: string){
    console.log("Signing In ... ");
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
              .then((res)=>{
                this.isLoggedIn = true;
                let user = new UserModel(res.user.email, res.user.displayName, res.user.photoURL);
                this.loggedInUser.next(user);
                // this.loggedInUser = 
                console.log("Signed In Successfully");
              })
              .catch((reason)=>{
                console.log("ERROR REASON: "+JSON.stringify(reason));
              });
  }

  async signUp(email: string, password: string){
    console.log("Signing Up ... ");
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
              .then((res)=>{
                this.isLoggedIn = true;
                let userModel = new UserModel(res.user.email, res.user.email, LOCALUSERS.photoUrl)
                res.user.updateProfile({
                  displayName: res.user.email,
                  photoURL: LOCALUSERS.photoUrl
                }).then(()=>{
                  console.log("SignUp Successful");
                });
              });
  }

  logout(){
    console.log("Logging Out ... ");
    this.firebaseAuth.signOut();
    this.loggedInUser.next(null);
    console.log("Logged Out Successfully");
  }

  getCurrentUserDetails(): Observable<UserModel>{
    // let userModel = null;

    // await this.firebaseAuth.currentUser.then((user)=>{
    //   userModel = new UserModel(user.email,
    //                             user.displayName??user.email,
    //                             // user.displayName?user.displayName: user.email,
    //                             LOCALUSERS.photoUrl);
    //   console.log("CURRENT USER: "+JSON.stringify(userModel));
    //   return userModel;
    // })
    // .catch((reason)=>{
    //   console.log("No one logged In");
    //   return null;
    // });
    // return await userModel;

    return this.loggedInUser.asObservable().pipe(
      map((user)=>{
        if(user.photoUrl==null){
          user.photoUrl = LOCALUSERS.photoUrl;
        }
        if(user.displayName==null){
          user.displayName = user.email;
        }
        return user;
      })
    );
  }

  updateCurrentUserDisplayName(displayName: string){
    this.firebaseAuth.currentUser.then((user)=>{
      user.updateProfile({
        "displayName": displayName
      });
    });
  }
}
