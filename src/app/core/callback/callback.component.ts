import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { colorSets } from '@swimlane/ngx-charts';

@Component({
  selector: 'mifosx-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    console.log(this.authenticationService.isAuthenticated())
    if (!this.authenticationService.isAuthenticated()) {
      this.authenticationService.token(this.route.snapshot.queryParamMap.get('code'))
      .subscribe({complete: () => {this.router.navigate(['/home'], { replaceUrl: true })}});
    }
    
  }

}
