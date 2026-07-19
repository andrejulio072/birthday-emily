import type { PhotoMemory } from './types'

const image18 = 'data:image/webp;base64,UklGRowEAABXRUJQVlA4IIAEAABwGwCdASpBAIwAPwlysVErpqSirZhrYXAhCWZMAFb5KE+ax6C4W/wDTbdWEjHsl393O0b1ESxz8J4IKuwJD9D8I+1zgCi/79eitgUDwAMmKWP7+XYQLczQOZlsvMUhAzmPzGFmqHWYtMF9jSL9tWr79cnusCZc6H/5Ego73Q7IJOY/3hco+twn7XI/SZikE746Rze2rz1dkmBzzFYxL7avVDoL54ppVFJLkV2PpqOJe49Jkm1EIbAYMMTwuls3BMkJpi+l1UqDhPojcig8cBQG7CfEBNG0/HfDtKnuPv/uBD+ygAAAq2zeue/zWmMNVWi21iq1J/VMxiP7F3X/ORxa7eTh3zWkQrmXucGA3ACjRjIoe/VzR4c7U4BVnP4iBVGQE5sOtrRQePgaQZlLGoNv6rYrUvqAZT7NPgu1mj/ii9AiGOpxIJr+vJZQj9/eRX7bA3Yw7UaELtPZHqdtKz/LAi2p2MPy+5jcYPPv+5yX1d//kevwRnLW3yB5Vkwh3OqumR7xkcbWhVapVbDK2ZZc9Za9ppZw2JlCSfEpNdSfg0EVbCjkUjpiEJl25VwT0MIBMU+hynGB+hylBeLkbxDu7jWYSSnJiLTwE0m5H5eFnYCPgoTeI8k3fXcrfsgWmXrz5gPt/T0Cucy3RwtEXgj6xC0oP+9qUUsKWUwCyE+VZ3DF2eF0h9ZZx9ElvDEPzOpYUMz7J45PtIth0ix/Ym2cBqyaUVqK3rfCykF1a+FGGBdVYBLCl+Zcw+oxlcvsL7Vkkn/x4URQ2cJ45R4CTXXmLfLfD/t+Ax6F5E+/CsApUeBGg/VB6GpFkoCaGYY5HZVTajZ6F9suKAlYcgX63RC4t/jj/+XVabxJFhk6kCIa8alGfU5KNMM5fXgsfrHSqm07w/e997XgwD1aSr09q9O2uuPpUOjo9q0q6cz0N4ubIz3jfbEaAi4I4Oz0VUJpDjIbRqsismU4KoklKjMl6qOs4VMZ4G+MAVWB06eZ/0t2YscBfkptqMMJdV7//JaVF1A7Nz2nhTZdqZzlnH5kYzzrOPld/8ndjucum0MnkOFl2gbe/e20+iH99OOPa8zJd07/7QhBE4TsTEBv+tgqf0zbhZUDSnJyAqwZqQAY864QQCvNB9hbNj1nc6IH6jGeaATtnXJeNvL248fx9X1YVBUo8Vw0ZiKjTQukyoplCP8C2lyLCLDQUwcy899Yc3FN+62qmkdjY+WOcNVta4VjH4OVBDRymPeiQBQYlkvg2b+DQy2UIh51kMCxTOKdmMS3NT7infTqR0ejBVFoQBwwp2v4ZQ1mNxy0Zu59qcSlDCaQpUj9w0k0iRd6VFG2CGmE+vRdK8xYob0uWiuwMJxgz0QxpY7f0uybIeelAwKdU1XwrcjDBt+Tz8OBORdbjFFoUXQjyF2aWfcxR/44A61K6qz8KndLx/8gEwBZfGb81pezdtL9dPTJWQC8yBVlKroj9gNcbA28vgkF9VWwZLAf6roJOlLNj9q7qhkriKnoOGDhxcnYA5Wt4H3qFfkWACIAAAA='
const image19 = 'data:image/webp;base64,UklGRsgEAABXRUJQVlA4ILwEAACwGwCdASpBAIwAPwl0rVCrpyQirBeN+XAhCWYAx2Q4jfsXz07Fawi23seS84QHbQ/cBhmNXnaugW6inmUqwyaqgvFBocXcYFkIIocCmxT5Rfc7Yj9adxq3jYy8x/ocgWbBOCHOtzh5nLXiUkjo8Nq0ZirAyPM+7t3b1SmPjEz+4wzIpOHaU1UNt5So5Hr+Dis4W7LrrktyUooXJx/VnKgt75rqJZrhNxC/BSrAOnIkZQgVaZshIH38MmFvuw3WmMJEku/qP1XHgX4smddRMzWSOsfuAWH6Rk8a83onNnIxxJXKe2KsQAD9+8QPH7o1L7N1Ugse4ytJ0h/XvJ61a4qu6aiMIOvhoXJ/GkkP1FpJTNFT7Vvh3mnU0USL8OytEBx2gzU7hxXpaL7QRvZn/tzjrn0u6t9TtWeZcQwYUjWIQdo14Qnc9cGn/Ypq0/kKwNxNwH206s8wdK7iNvWu7HQFhGDeBr7+kqbpAhpljaWsuzqXfFph/qeWJ6O7g6cmT5tG39UeY3xMrYLd3mKBVnW3x659U+aHg2Eylqg+L8cMsTE+Kzi0AH1YdXtxquouUTXoTSfFBZ3TR/DZR3iMw6o0J4ki8Krw61SozX21GklUFdyqwb/G/lxY9OnIVIZwu8To5rf8BjR1rVaojJkImpceD6YeuoGv7t70fX+RvcjMfsct4TuKklFAhFtSDJoXParTVEnJZPuzJ+LRMnYdYkchmdjZVgvI0EPWEjCUCJWsUOzPqdCctAek5aecFNx49j696Ls9Mmp59FeY38tEnfFpT70SNS5SQfCw6UqW4aaTRkpteg9uVi+F8dwlrXv4LpOte/gbzHncEv9J3g9LPlJRGh1b394TZCyQcmc3LWmx7Kq6vXeFuYJmughcZ8rR8rxSfmIm3k9WQxrghPXIXaUMMEL3rs7odD0XukRk4QVfRb4uDr+S6FXY+wPxM6o69r6lIzRCpN5oK1uBYB9mx0CoHwC/mBtEx4re4qY1sf+SNuDh3tDrKfw5eNwZ60Z4LttsOer+YeFKiv0kXjrHa9Wa7dd8hKLOz4nwxeRgz/aT4KltFDlKLyUepcdxjS9uJ6mDySuxE3u2pJg1Hej/ORWawzj783ya33Fz0qbK0SKqYNXz2V7pRuF7WzlwQ2bQ5Wct0W+t6qAvFXegQHnFgbmF+mGgdR469n7sVWzhr2y4ApMr7pk5SXmVWaWGlRi8FygSmxsLGwOkb9H2lmyJqJ15EXUtf9N537Q3UxubWf6XN+358oRnzySh1BoxumwLh73TP/ddG0zDIA0ENMI9UVuliGXmvl5/zUjQKn7wKvVy2fa+7p5+0vwwU0qcMq01BG5LqjmtQFYaXO8ejaUxR3BakQE9w43IFdy4dhCohNwPJB0MWyE6/MXlxQQk4GKjHjkVKS546/fnl4NiZ3tMUmit5D87L3dK+RWHX3Io9OQAnZDRBITMFkAIHeJIGfiIKNHpx/rJK4cxsKUcRXUg/fB+UTsheuESF1WBr3qxb2vOVxyPT/es0fweULkW/9MOXzU/vYhklSa6MY8ISLUyhRe4TkzKNkbzh0VlpQVYf4JbPsISWuTHFCK7mWemQTMV7FJtsbFbQjFgf4zmgAA='
const image20 = 'data:image/webp;base64,UklGRugDAABXRUJQVlA4INwDAADwGQCdASpBAIwAPwlyrVCrpqkuLvSdUcAhCWgIcAF7NTCcQdV+bClSMime/ez3Z9uOsRMMvM1SZrlAZIm4le5uYeQNAQ1/Ce0YV6mbMA6D8PAES1EH+0rLvv5oJ7l3QjGpNuFPWb7n+UmT7MUkzEQ65ClZh6DdXWVu7Qc7tzRHMEmD1iCqSS2EvSp7Ff4N21HhER7ZwNCDAAmV9tPwpCPJOZ7Y3K7cKHhSq6cXnAqw9DWWXyZP7irWQlUUJt87otBCVQn+mJdUPN4jBC4+N9XD8+1v1uYcX8AA+daNAf5ZE47L3sRgVpFZV9ZuTHEn85t09S9SxCRIM964lRYPeCsDvJMzi0Mpt61xIzSS/HJ/FQcLOCTVcC5VLzL9s9XERyKKTvEy1Q/0lbe4Qtla1hXjxtrAKkPK1zNl9CyDE7laI6uYhC6Hqzl0UX8GNXNH6CEAxbyojHbuT7Xe3Jz+NoqiDiNVk3zgpTXmyLCGxtatLq9CT1menafw8fRkyRDzURmJJVmgYF1yvlK8JYqGIKEd0S0mGZLLRsqFjm7xfsh8CRJ5pMC1YHgYJHdp4Q7DYdOHeFz+/WeaWsW8b3C78nqHxqguZlZT8eADZidUElI5ZRMQE39Nrnt+9GistMxlpFIpV2RD6MU212GfQqKX+nQr2X2kSNXkR0olzJpzYMx+80kdFR0JjMNAp1gROTndobWi3vVF6NEbAMJgl9MXfADztTd8g/613YSUGmIhLcEo6N7LJEK5s0SWGTYJJDQrBFy26GOkQc5fHaV8b7lpbmfekKgTdeq2mLHLokRhs+utGST12uQzitgofYYea6foedo1XKiW80MrTKjPbvPH38w0mT6wHsVhb7I742ExX7eOxjqYVJEDK7FMb4gsu9EhbAPfx0bHtpP9sRk+y2MbKifHhcnFiXTpR1h5QUVeU+I7CXDcstj4uChLb251q1z16khKCcKdCrXJqSRjyqZ95A8LCfEbF8xshKkCEl9hi6tpzT79N+QD7ngWTz/TqX/Y0tLS3YBHkxVJlXnm19b8WLRdRoF2mT8Sizt0UEbfWmr8RGQ5P7Xfi/3NhK6R7yS24s0kXx1p+CF/KYKURJaRy15t4LZv2wYv8JlHUv7Tc4h02aZ6NFHajD7XhkXE3QetGVrSET9J44a2PpbMcMOsDf/+ko8G8Hs4ElYzyos5vnBS1T6nscwIHSCQTof0gka/GcSywzeKp3i+8Bfo5kGcuVijq/rnyTGAYfO4JHzU39Bq8Pz33TbCbA2+N7To0m3qZwr8dEjRLXGBYJ048ThL77Nz9lXRDdv5pPTCwAAA'

const photos: PhotoMemory[] = [
  {
    id: 'adventure-018',
    thumbSrc: image18,
    displaySrc: image18,
    blurDataUrl: image18,
    width: 65,
    height: 140,
    alt: 'Emily — The enchanted forest was clearly made for her',
    caption: 'The enchanted forest was clearly made for her',
    orientation: 'portrait',
    position: '50% 46%',
    chapter: 'adventures',
    fallbackThumbSrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-018-480.webp',
    fallbackDisplaySrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-018-1280.webp',
    source: 'github',
  },
  {
    id: 'adventure-019',
    thumbSrc: image19,
    displaySrc: image19,
    blurDataUrl: image19,
    width: 65,
    height: 140,
    alt: 'Emily — Moonlight was clearly made for Emily',
    caption: 'Moonlight was clearly made for Emily',
    orientation: 'portrait',
    position: '50% 46%',
    chapter: 'adventures',
    fallbackThumbSrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-019-480.webp',
    fallbackDisplaySrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-019-1280.webp',
    source: 'github',
  },
  {
    id: 'adventure-020',
    thumbSrc: image20,
    displaySrc: image20,
    blurDataUrl: image20,
    width: 65,
    height: 140,
    alt: 'Emily — Walking straight through the heart of the story',
    caption: 'Walking straight through the heart of the story',
    orientation: 'portrait',
    position: '50% 46%',
    chapter: 'adventures',
    fallbackThumbSrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-020-480.webp',
    fallbackDisplaySrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-020-1280.webp',
    source: 'github',
  },
]

export default photos
