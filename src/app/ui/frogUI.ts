import { createSystem } from 'frog/ui'

export const { Spacer, Box, Heading, Text, VStack, HStack, Image, vars, Row, Rows, } = createSystem({
    colors: {
      Text: '#000000',
      AccentText: '#fa709a',
      background: '#ffffff',
      background200: '#ffffffE6',
      background300: '#ffffff80',
      background400: '#ff000020',
      blue: '#0070f3',
      green: '#00ff00',
      red: '#ff0000',
      orange: '#ffaa00',
      gradient: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
      gradient2: 'linear-gradient(to right, #641f8c 0%, #591580 100%)',
      ticket: '#fef6ff'
    },
    fonts: {
      default: [
        {
          name: 'Open Sans',
          source: 'google',
          weight: 400,
        },
        {
          name: 'Open Sans',
          source: 'google',
          weight: 600,
        },
      ],
      madimi: [
        {
          name: 'Madimi One',
          source: 'google',
        },
      ],
    },
  })