
const ALL_ROUTES = [
  '/account',
  '/account/menu',
  '/account/order-history',
  '/account/schedule-trunk',
  //'/account/appointments/(schedule|confirm)/call',
  '/account/appointments',
  '/account/request-featured-trunk/:id',
  '/account/wardrobe',
  '/account/measurements',
  '/account/pinterest',
  '/account/payment-shipping',
  '/account/payment-shipping/new-address',
  '/account/payment-shipping/new-credit-card',
  '/account/referrals',
  '/account/support',
  '/account/redeem',
  '/account/gift-cards',
  '/account/trunk-request',
  '/account/budget',
  
  '/account',
  '/confirm-appointment/:token',
  
  '/account/appointments/schedule',
  '/account/appointments/modify/:id',
  '/account/appointments/:token',
  '/account/appointments',
  
  '/account/appointments/schedule/call',
  //'/account/appointments/schedule/call/:id(\d+)',
  //'/account/appointments/confirm/call/:id(\d+)',
  
  '/account/pinterest/authorize',
  
  '/account/pinterest',
  '/account/pinterest/boards/:board_id',
  '/account/pinterest/boards/:board_id/:pin_id',
  
  '/account/wardrobe/item/:itemId',
  '/account/wardrobe/outfits',
  '/account/wardrobe',
  
  '/trunks/starter/:salesOrderId',
  //'/trunks/:id(\d+|feedback)',
  '/experience-rating/:sales_order_id',
  //'/(try-a-new-stylist|keep-my-stylist)',
  '/account',
  '/confirm-appointment/:token',
  '/forgot-password',
  '/reset-password',
  '/login',
  '/logout',
  '/onboarding',
  
  '/trunks/starter/confirmed',
  '/trunks/starter/:salesOrderId/:styleVariantId/:uuid',
  '/trunks/starter/:salesOrderId',
  
  '/onboarding/:gender/clubhouse-preference',
  '/onboarding/:gender/motivation',
  '/onboarding/:gender/trunk-schedule',
  '/onboarding/:gender/account-info',
  '/onboarding/:gender/height-weight',
  '/onboarding/womens/style/:id',
  '/onboarding/mens/style/:id',
  '/onboarding/mens/stores',
  '/onboarding/womens/stores',
  '/onboarding/:gender/stores',
  '/onboarding/womens/brands',
  '/onboarding/:gender/age',
  '/onboarding/mens/budget',
  '/onboarding/womens/budget',
  '/onboarding/womens/pant-style',
  '/onboarding/womens/pant-rise',
  '/onboarding/womens/tops-style',
  '/onboarding/womens/dresses-style',
  '/onboarding/womens/shoes-style',
  '/onboarding/womens/heel-height',
  '/onboarding/womens/jewelry-style',
  '/onboarding/womens/dislike-patterns',
  '/onboarding/:gender/colors',
  '/onboarding/mens/pants-fit',
  '/onboarding/mens/shirt-fit',
  '/onboarding/mens/fit-issues',
  '/onboarding/mens/work',
  '/onboarding/mens/weekend',
  '/onboarding/mens/shirt-size',
  '/onboarding/mens/shoe-size',
  '/onboarding/mens/waist-size',
  '/onboarding/mens/inseam-length',
  '/onboarding/womens/conceal',
  '/onboarding/womens/needs',
  '/onboarding/womens/avoid',
  '/onboarding/womens/weekday',
  '/onboarding/womens/bra-band',
  '/onboarding/womens/bra-cup',
  '/onboarding/womens/dress-size',
  '/onboarding/womens/pant-size',
  '/onboarding/womens/shoe-size',
  '/onboarding/womens/shirt-size',
  '/onboarding',
  
  '/trunks/:id/update-payment',
  '/trunks/:id/update-payment/new',
  '/trunks/:id/payment/new',
  '/trunks/:id/select-return-method',
  '/trunks/:id/schedule-pickup',
  '/trunks/:id/shipping/new',
  '/trunks/:id/rating',
  '/trunks/:id/checkout',
  '/trunks/:id',
  
  '/trunks/:id/confirmed',
  '/trunks/:id',
  
  '/trunks/:id/decline',
  '/trunks/:id/addons',
  '/trunks/:id/addons/:styleVariantId',
  '/trunks/:id/confirm',
  '/trunks/:id/payment/new',
  '/trunks/:id/confirm/payment',
  '/trunks/:id/shipping/new',
  '/trunks/:id/confirm/shipping',
  '/trunks/:id',
  
  '/trunks/:id',
  
  '/trunks/:id/confirmed',
  '/trunks/:id',
  
  '/trunks/:id/item/:itemId/:styleVariantId',
  
  '/trunks/:id/item/:itemId/:styleVariantId',
  
  //'/try-a-new-stylist/:shopping_cart_id(\d+)/:reason',
  '/try-a-new-stylist',
  //'/keep-my-stylist/:shopping_cart_id(\d+)/:reason',
]

const uniqueRoutes = () => {
  const unique = [...new Set(ALL_ROUTES)]

  unique.sort()

  return unique.filter(route => {
    if(route.indexOf(':') === -1) {
      return route
    }
  })
}

const cleanRoutes = [
  '/account/appointments',
  '/account/appointments/schedule',
  '/account/appointments/schedule/call',
  '/account/budget',
  '/account/gift-cards',
  '/account/measurements',
  '/account/order-history',
  '/account/payment-shipping',
  '/account/payment-shipping/new-address',
  '/account/payment-shipping/new-credit-card',
  '/account/pinterest',
  '/account/pinterest/authorize',
  '/account/redeem',
  '/account/referrals',
  '/account/schedule-trunk',
  '/account/support',
  '/account/trunk-request',
  '/account/wardrobe',
  '/account/wardrobe/outfits',
  '/forgot-password',
  '/login',
  '/logout',
  '/onboarding',
  '/onboarding/mens/budget',
  '/onboarding/mens/fit-issues',
  '/onboarding/mens/inseam-length',
  '/onboarding/mens/pants-fit',
  '/onboarding/mens/shirt-fit',
  '/onboarding/mens/shirt-size',
  '/onboarding/mens/shoe-size',
  '/onboarding/mens/stores',
  '/onboarding/mens/waist-size',
  '/onboarding/mens/weekend',
  '/onboarding/mens/work',
  '/onboarding/womens/avoid',
  '/onboarding/womens/bra-band',
  '/onboarding/womens/bra-cup',
  '/onboarding/womens/brands',
  '/onboarding/womens/budget',
  '/onboarding/womens/conceal',
  '/onboarding/womens/dislike-patterns',
  '/onboarding/womens/dress-size',
  '/onboarding/womens/dresses-style',
  '/onboarding/womens/heel-height',
  '/onboarding/womens/jewelry-style',
  '/onboarding/womens/needs',
  '/onboarding/womens/pant-rise',
  '/onboarding/womens/pant-size',
  '/onboarding/womens/pant-style',
  '/onboarding/womens/shirt-size',
  '/onboarding/womens/shoe-size',
  '/onboarding/womens/shoes-style',
  '/onboarding/womens/stores',
  '/onboarding/womens/tops-style',
  '/onboarding/womens/weekday',
  '/reset-password',
  '/trunks/starter/confirmed',
  '/try-a-new-stylist'
]

// const threadComponents = [
//   'Accordion',
//   'Button',
//   'Checkbox Group',
//   'Divider',
//   'Fieldset',
//   'Input',
//   'Legend',
//   'Menu Option',
//   'Page Description',
//   'Page Header',
//   'Primary Button',
//   'Radio Group',
//   'Secondary Button',
//   'Section Header',
//   'Select',
//   'Spinner',
//   'Sub Header',
//   'Text Area',
// ]

const threadData = [
  {
    name: 'Accordion',
    variants: [
      'Basic Usage',
      'Allow Multiple To Be Open',
      'Header On The Bottom',
      'Controlled Component',
    ]
  },
  {
    name: 'Button',
    variants: [
      'All colors'
    ]
  },
  {
    name: 'Section Header',
    variants: [
      'Default usage',
    ]
  },
  {
    name: 'Select',
    variants: [
      'w/ screen reader label',
      'w/ screen reader label & value',
      'w/ screen reader label & placeholder',
      'w/ screen reader label, placeholder & value',
      'w/ screen reader label & error',
      'w/ screen reader label, value & error',
      'w/ visible label',
      'w/ visible label & value',
      'w/ visible label & placeholder',
      'w/ visible label, placeholder, & value',
      'w/ visible label & error',
      'w/ visible label, value & error',
    ]
  }
]

const formatThreadString = (value) => {
  let formatted = value.split(' ')
  return formatted.join('%20')
}

const threadRoutes = (components) => {

  const routes = []
  for (let component of components) {
    const formattedName = formatThreadString(component.name)
    for (let variant of component.variants) {
      const formattedVariant = formatThreadString(variant)
      routes.push(`/iframe.html?selectedKind=${formattedName}&selectedStory=${formattedVariant}`)
    }
  }

  return routes
}


module.exports = {
  customerApp: cleanRoutes, // uniqueRoutes(),
  thread: threadRoutes(threadData),
}