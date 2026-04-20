import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css']
})
export class PaymentResultComponent implements OnInit {
  status: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING' | 'loading' = 'loading';
  transactionId = '';
  reference = '';
  pedidoId = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id     = params['id'] || '';
      const status = (params['status'] || '').toUpperCase();
      const ref    = params['reference'] || sessionStorage.getItem('wompi_reference') || '';

      this.transactionId = id;
      this.reference     = ref;
      this.pedidoId      = sessionStorage.getItem('wompi_pedidoId') || '';

      this.status = ['APPROVED','DECLINED','ERROR','PENDING'].includes(status)
        ? status as any
        : 'PENDING';

      sessionStorage.removeItem('wompi_reference');
      sessionStorage.removeItem('wompi_pedidoId');
    });
  }

  get isApproved()  { return this.status === 'APPROVED'; }
  get isDeclined()  { return this.status === 'DECLINED'; }
  get isError()     { return this.status === 'ERROR'; }
  get isPending()   { return this.status === 'PENDING' || this.status === 'loading'; }
}
