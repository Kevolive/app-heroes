import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

public heroForm = new FormGroup ({
    id:           new FormControl<string>(''),
    superhero:    new FormControl<string>('', { nonNullable: true }),
    publisher:    new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:    new FormControl(''),
    first_appearance: new FormControl(''),
    characters:   new FormControl(''),
    alt_img:     new FormControl('')

})


public publishers = [
  {
    id:"DC comics", desc:"DC - Comics"
  },
  {
    id: "Marvel Comics", desc:"Marvel - Comics"
  }
]

constructor(
  private heroesService: HeroesService,
  private activatedRoute: ActivatedRoute,
  private router: Router,
  private snackbar: MatSnackBar,
  private dialog: MatDialog,
) {}

get currentHero(): Hero {
  const hero= this.heroForm.value as Hero;
  return hero;
}

ngOnInit(): void {
  if (!this.router.url.includes('edit')) return;

  this.activatedRoute.params
  .pipe(
    switchMap( ({id}) => this.heroesService.getHeroById( id) ),
  ).subscribe(hero => {
      if (!hero) return this.router.navigateByUrl('/');

      this.heroForm.reset(hero);

      return;
      }
    )

}
onSubmit():void {

  if( this.heroForm.invalid) return;

  if(this.currentHero.id) {
    this.heroesService.updateHero(this.currentHero)
    .subscribe( hero =>{
      //TODO: mostrar snackbar

      this.shownackBar(`${hero.superhero} update!`)
    })
    return;
  }

  this.heroesService.addHero(this.currentHero)
  .subscribe( hero => {
    //TODO: mostrar snackbar
    this.router.navigate(['/heroes/edit', hero.id]);
    this.shownackBar(`${hero.superhero } created!`)

  })

}

onDeleteHero ( ) {
  if (!this.currentHero) throw Error ('Hero id is required!');

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: this.heroForm.value
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    this.heroesService.deleteHero( this.currentHero.id)
    .subscribe(wasDeleted => {
      if ( wasDeleted )
        this.router.navigate(['/heroes'])
    })

  });


}
shownackBar(message: string): void {
this.snackbar.open( message, 'Ready', {
  duration: 3000
})
}
}
