import fs from 'fs'
import path from 'path'

describe('TrainingLibraryFirstCardHeader download disabled cursor styles', () => {
  const componentPath = path.resolve(
    process.cwd(),
    'src/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardHeader.vue'
  )
  const stylesheetPath = path.resolve(
    process.cwd(),
    'src/assets/scss/pages/training-library/training-library.scss'
  )

  it('uses a disabled download activator class with default cursor styling', () => {
    const component = fs.readFileSync(componentPath, 'utf8')
    const stylesheet = fs.readFileSync(stylesheetPath, 'utf8')

    expect(component).toContain('training-library-list-view-first-card-header__download-activator')
    expect(component).toContain('training-library-list-view-first-card-header__download-activator--disabled')
    expect(stylesheet).toContain('.training-library-list-view-first-card-header')
    expect(stylesheet).toContain('&__download-activator')
    expect(stylesheet).toContain('&--disabled')
    expect(stylesheet).toContain('cursor: default !important;')
  })
})
