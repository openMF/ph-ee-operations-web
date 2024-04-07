import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mifosx-callback',
  templateUrl: '../../web-app.component.html',
  styleUrls: ['../../web-app.component.scss']
})
export class CallbackComponent implements OnInit {

  private storage: any;

  constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    if (!this.authenticationService.isAuthenticated()) {
      this.storage = localStorage;
      this.authenticationService.token(this.route.snapshot.queryParamMap.get('code'))
      .subscribe({complete: () => {
        this.router.navigate([this.storage.getItem('location')], { replaceUrl: true });
        this.storage.removeItem('location');
    }});
    }
    
  }

}
