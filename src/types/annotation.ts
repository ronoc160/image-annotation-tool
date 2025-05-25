export type AnnotationType = 'polygon' | 'arrow'

export interface Point {
  x: number
  y: number
}

export interface PolygonAnnotation {
  id: string
  name: string
  type: 'polygon'
  points: Point[]
}

export interface ArrowAnnotation {
  id: string
  name: string
  type: 'arrow'
  start: Point
  end: Point
}

export type Annotation = PolygonAnnotation | ArrowAnnotation
