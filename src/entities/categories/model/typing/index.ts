export interface Category {
  id: number
  name: CategoryName
  gender?: 'men' | 'women'
}

export enum CategoryName {
  All = 'All',
  Denim = 'Denim',
  JacketsVests = 'Jackets_Vests',
  Pants = 'Pants',
  ShirtsPolos = 'Shirts_Polos',
  Shorts = 'Shorts',
  Suiting = 'Suiting',
  Sweaters = 'Sweaters',
  SweatshirtsHoodies = 'Sweatshirts_Hoodies',
  TeesTanks = 'Tees_Tanks',

  BlousesShirts = 'Blouses_Shirts',
  Cardigans = 'Cardigans',
  Dresses = 'Dresses',
  GraphicTees = 'Graphic_Tees',
  JacketsCoats = 'Jackets_Coats',
  Leggings = 'Leggings',
  RompersJumpsuits = 'Rompers_Jumpsuits',
  Skirts = 'Skirts',
}
