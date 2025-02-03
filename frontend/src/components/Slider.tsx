import type { ChangeEvent } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

interface SliderProps {
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly label: string;
}

export const Slider = ({
  value,
  min,
  max,
  step,
  onChange,
  label,
}: SliderProps) => (
  <>
    <Form.Label
      column
      sm="4"
      className="small-label"
    >
      {label}
    </Form.Label>

    <Row>
      <Col>
        <Form.Range
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
        />

        <div className="d-flex justify-content-between">
          <div className="small-label">{min}</div>
          <div className="small-label">{max}</div>
        </div>
      </Col>

      <div style={{ width: '90px' }}>
        <Form.Control
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          className="blend-input"
        />
      </div>
    </Row>
  </>
);
