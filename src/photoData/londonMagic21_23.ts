import type { PhotoMemory } from './types'

const image21 = 'data:image/webp;base64,UklGRs4DAABXRUJQVlA4IMIDAABwGQCdASpBAIwAPwl0rlA/pyQmrZa9O/AhCWgOuC9ABwsQ1h5oavV3AvPaHjapvnYjiO9WeAHHDQvBTXG48I1G730z21/rN/LbFvOePabpLxfu+elG42kCK7uw6mekkjShW0v7f/JVHmTq+aO/3UrWfxQ44j4T0sS4N+Rbla7Ug13Uk78zkZf0RqPrPcfwTchcnlq4AgoPJ2PIfoV7P4Q7HtgRpX8XIuUFQozHvVDc9+zrBT4+WM9Obhf2FMdIHY+soWu/cWnfudI0CleomwQ1EPUvgAD+FGL4qbn7rXtEeOyt1RoQ2amU+A9lRS71MJL5U+mPfitqgPGmBc9FlolUFiUqInwcFD/JhtIoguwHYPWyLWAx0v5KqF64RA4sYfD57OTAR/9XTWbDIsdMys6+lvgQeIQYw3UhdNzAecnOhCQRJ1KYNbToF6gRLCB2P39cxhf17EourxtpKM0Z3qd/kh+PnROQZ8uGKfvy5DcW4nIw8Siu2L3Zl9ckLrDEcx5xfIM6xVPa6ifTvba78H2eqGGF34N6a3UKH5cvWNyGsxT4Ifi7I/zrBaseZo75xkoHkd31GnHx4lWdemwp9/Xr/J8V+dYpeAQ4OO/LDrPtckmc6ebEzy+7OZi4e1XpKtxsqFuOxUhZKcZ7reaNncDOr66W8ctk3eY7EgtHgyTmG2kkYgBR5931GP2P33EKevGwsuwMYrQijyYhzxlEHBwykWRdS+g94FWH0VFZumyB7NR3/2YKusUH3dvLZOOaKf9kJq/eXVUvx0JwEs8qpxjfG6/caddF3+rXZkkSz7rqvT3GJi6Wbl9D/Fco3Gm/UhhzJZvlSq6YAYJcQNKczVPOQFLYS7njxPm4OT2rxqtM7UmU+74VsVANouFEd7xZN1u0O3DMZwkJGuqW6mzfVblPEixxQT47Nouj21zT9t1NNjvvBV+FtZwkutExKKKjGGIeMVEPVyn6tGo1RAhdJ2AYyfLWkt247ZROWJufNsuGxCww3hnMYM9QMynqu9RjC05L+Rv4l0c+Ax+VTAI034iTjBMnwbIlPH3P9DWIP6V2hft3mhJGZU0Q307eA8SbGAIEk0xLn23QpaTpwHb8tUUkO218kM9qHzc/e9zguZj5V8iwq+DfFdcfbjRo8WhZdxNsasndlHpRyCSbszzQyedyDojc0uzOOiKCh4V/x5MKfpYfvG+6w2VEMQG7etxbLOYe3xJV/qHK54Z887PCRJTKhAIfk5VUl24t8T0VyM8PIW07cFIUtifi7sRF4Jl3UsAAAA=='
const image22 = 'data:image/webp;base64,UklGRqoEAABXRUJQVlA4IJ4EAADQGwCdASpBAIwAPwlwsFKrpiQirBS82XAhCUZwAL/Ope0k3uloK64Y8+jz8l5e1cTSM6WAs3r/3cCT4MBUwyTT1pQtVhHBbC6f5QDY9cCzp1D1SD1eXyN/wJn62OdoSCmx2sw2gtrIwdHmy4iDzm3e9xOuFlTxpCNx4bCUbrhb8qzetQ/0TtkVYMPryijsbvCzXsVVaD6DNP1dMvfniZ+jJUs3uytpGqfXqja/zCQywksoCl8mI3RXAyVtJLl2fLnEzrp0b+8Z59/S+tvsjk0888GvyvmwNSqo87onBvdunVJOu0UmliAA/vB1db/GacUmqwM+A3h3N7ncFXvi7x14wUmiCb8HweofP9Uw8GKqlTwseE6e6ARIBOv0Jwy/8bG3/K7tmB0IDJ0vse6oBFO9D7U/EdhTaay8ORmymIeY2u0Hz0ZQuCEtjyNz+EkJNauWJ+LawaxiosWIfUfFqhv8y9CaM4jTXXvPEUAM+LT/pgz+nvKELz7nc1Sm4Syx+Bi6NZsPgROhB26pjEgxExmFB0fFp/ooOGapQyVIfu6wx1XHRvTjhjdpTwklR2Y/okLuXytEbCybAQN9PXi1QmRwmLFOJsofQZa8XkfV1+BHsYh3uuxZPECIoYp5LDMhZnpbpFPigVM7SgFERp172fRHXpQU8eXDE8tCmyHzY3dM39uPVRHR21awOKnY+1fxkFdaA+UQ71orAkKvC/0/ibJ1hE33Ptgvpbu9EvrG/Q5x9oEMZ0UbojYADGSeaxrwJQ/DUjhQ60LXnJBKEqAe84+jS7vitW7KkmJexOhfnsWGCWwlRjEeG3x3NmrN0URU8bn6AEE4ruzWCJyibHR2rXdh8/sgrPk8RqGFqFt3qnJ/51CXytRqzyK8yw15uHL7VIAtwu2HLGfW2U4NBocATGfYXPp7WFKGuuUx4XbKqkdv4BnfY45dYB1fZFM0RUOmbXXKMLKhgEVr2t0MSoMqQq0Cx7aQmldmD6Q7YbXxUQsYFf9IONnovBKWl7L9BuIc9gWdY3C4PM6Y24U4KRb5otssz76PAcnKXvLusJ7lu1kCSj5fQ8Uo9uiMfAbEgmYJbMZcsTwCG5kcWDCy+PQndX3PK2fowhC3fY/aXMRWazfHKDk5ao3Yhk7RiI3yks7SBwoLBuKGK5RthqcK/eeFeIUOCunvx2rZI1JaQryX/iLJEFNgjOYrVOq0Vd8iC5TCpUg1cvqlKR1vQQegnu8AA8qDNkwijChfk2Qu7ZBswMUmMz+YkYael2wT1PGcaqzhwNbCsM+ow+kFhIxN3T8WDKw+KXEVEof2G51/+Su7LqDfaSS8iVPK6UtReUsztP9awV4pjh5/KF/EOkU1JhEJW4x/mqcRZcWm5nqOTwzDymZ8/A1UjEl3tlA98DnG/ctIyrCXLoND1FJpYITbLXECGOudspw/fU7ymd/vEna1L4KR/WjmDBe1yu2D0eOZjrZbz26NJveRXIIru8+tZgjjqEf5OZZhcjSaTdH3R9N4aE68hH3urMmEtLzVJgsIsgPFOrnxft/0DWBxDYYIXteIpI+zhBeMndnrpNqe0XcgAAA='
const image23 = 'data:image/webp;base64,UklGRjoDAABXRUJQVlA4IC4DAACQEgCdASpBAIwAPwl+tVUrqCWtJFgLsaAhCWIA0PVeZYwiX3w3nPAppSDqMPatbtHwqeqizMuqkvUgEAG2xR1R0j0tIaT1MBrHrSng7QyCrimbkQPVrJUEG0xqC2fcuckDe2/DoQtL4r8P+F57la2twi2YZNDywKbXmjmcw3oG5pSkvoh6vf1WEbb0d2KaG+beM42BXxle6SbAF/qgAP70GeWn+Va5w3XwCEujZYpWx13p2nuTpOt6suTUuS4S555l/wg44tGo2KLy8U1JB23FsvXyCqenYIrKGsZDmqkON2wFJW/tmDNqTBZkkARdzV/3eCz4ir7WC2ZxKXYRm/BmOJGnm7/nVvUgSLTmYq1e0xbXSp7p0dnEeCe/dg4xy18A3vKG9pNuFoZ9C4O1Dv4rFYXHpeZrYDaUBrhNMzPMm329+qQzbQ0ccMWP22aRatXZHb16cxCV6bURjQiq06qerTob2p8xA3Jn1/Jx/LA1ddgH/8nmZt1vBxGdPoO0ZBPiaqoQRQiuhSjVTTwOij1ZSvhmTYCx5HMFPZXXclVB5qjde/YYttGfn56Tk3ziO/kU9OakYbt93hslPfIYN1AuRQJe1jBFyQqD/qnndJVvMxqauoFth4gJjpIuYemDwR0Ete4HBiyLZKHiy9Er54UlgT1Bx7Z2AfNn9zKJpAOrA6Fm1SqDPusWfw1aw70y1tlhOyxMtQKMthHgnGsQt1sY6ApGmp+9tzfs499XBXHuwR0N0ygitrqu8yUgf9cm5VtK9NUFTGfLgUk6lJujiUUm8NuTR1rtUB2fiXHug9RaNn0cT9Yt9XdAJ83V1qEcEshXXTAHXeLq5+3EuFt5xZnDn4zB0UCWJ6lNcnQQNbAmBL+zWJN0R0DVRcJzH0nsL117aqFjsom5/2IYE0dJazeU2790aLVH1axB9YsirdJaw077dcyANqsB3dpIhjSVt942W82Ev3a3DaBliqLzQ6YayiW+bIMP2kzisse0TrXfhY4801tbiAGqfJy5XULsGv/oKloMHLZGgS1oaipF547ZxOwCF8uLfAWuEwDjqN/vArtImE0N1zPrJy2AAAAA'

const photos: PhotoMemory[] = [
  {
    id: 'adventure-021',
    thumbSrc: image21,
    displaySrc: image21,
    blurDataUrl: image21,
    width: 65,
    height: 140,
    alt: 'Emily — One heart was never going to be enough',
    caption: 'One heart was never going to be enough',
    orientation: 'portrait',
    position: '50% 46%',
    chapter: 'adventures',
    fallbackThumbSrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-021-480.webp',
    fallbackDisplaySrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-021-1280.webp',
    source: 'github',
  },
  {
    id: 'adventure-022',
    thumbSrc: image22,
    displaySrc: image22,
    blurDataUrl: image22,
    width: 65,
    height: 140,
    alt: 'Emily — Sweet, beautiful and fully prepared to fight anxiety',
    caption: 'Sweet, beautiful and fully prepared to fight anxiety',
    orientation: 'portrait',
    position: '50% 46%',
    chapter: 'adventures',
    fallbackThumbSrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-022-480.webp',
    fallbackDisplaySrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-022-1280.webp',
    source: 'github',
  },
  {
    id: 'adventure-023',
    thumbSrc: image23,
    displaySrc: image23,
    blurDataUrl: image23,
    width: 65,
    height: 140,
    alt: 'Emily — A reminder that her dreams are still calling',
    caption: 'A reminder that her dreams are still calling',
    orientation: 'portrait',
    position: '50% 46%',
    chapter: 'adventures',
    fallbackThumbSrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-023-480.webp',
    fallbackDisplaySrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-023-1280.webp',
    source: 'github',
  },
]

export default photos
