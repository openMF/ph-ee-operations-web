import { Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { AlertService } from 'app/core/alert/alert.service';

@Component({
  selector: 'mifosx-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.scss']
})
export class IdentifierComponent  implements OnInit {
  @Input() identifier: string;
  @Input() completed = false;
  @Input() display = 'right';

  iconVisible = false;
  displayL = false;
  displayR = true;
  emptyValue = false;

  constructor(private clipboard: Clipboard,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.emptyValue = (!this.identifier || this.identifier === '');
    this.displayL = (this.display === 'left');
    this.displayR = (this.display === 'right');
  }

  isLongValue(): boolean {
    if (this.identifier == null) {
      return false;
    }
    return (this.identifier.length > 15);
  }

  copyValue(): void {
    this.clipboard.copy(this.identifier);
    this.alertService.alert({ type: 'Clipboard', message: 'Copied: ' + this.identifier });
  }

  mouseEnter() {
    this.iconVisible = true;
  }

  mouseLeave() {
    this.iconVisible = false;
  }
}
