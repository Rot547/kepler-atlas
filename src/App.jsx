import { useEffect, useState } from 'react'
import './App.css'

const laws = ['Ellipse', '1. Gesetz', '2. Gesetz', 'Jahreszeiten', '3. Gesetz']

function EllipseScene({ eccentricity, playing, phase, layers }) {
  const cx = 500
  const cy = 370
  const a = 330
  const b = a * Math.sqrt(1 - eccentricity * eccentricity)
  const c = a * eccentricity
  const sunX = cx - c
  const px = cx + a * Math.cos(phase)
  const py = cy + b * Math.sin(phase)
  const periX = cx - a
  const aphelX = cx + a

  return (
    <svg className="ellipse-scene" viewBox="0 0 1000 740" role="img" aria-label="Elliptische Planetenbahn">
      <defs>
        <radialGradient id="sun">
          <stop offset="0" stopColor="#fff4a1" />
          <stop offset=".45" stopColor="#ffc94a" />
          <stop offset="1" stopColor="#f2a02f" stopOpacity=".05" />
        </radialGradient>
      </defs>
      {layers.ellipse && <ellipse cx={cx} cy={cy} rx={a} ry={b} className="orbit-line" />}
      {layers.axes && <line x1={cx-a} y1={cy} x2={cx+a} y2={cy} className="axis-line" />}
      {layers.distances && <line x1={sunX} y1={cy} x2={px} y2={py} className="radius-line" />}
      {layers.areas && <>
        <path d={`M ${sunX} ${cy} L ${cx-a*.72} ${cy-b*.69} A ${a} ${b} 0 0 1 ${cx+a*.18} ${cy-b*.98} Z`} className="area area-a" />
        <path d={`M ${sunX} ${cy} L ${cx+a*.45} ${cy+b*.89} A ${a} ${b} 0 0 1 ${cx-a*.30} ${cy+b*.95} Z`} className="area area-b" />
        <text x="350" y="205" className="area-label">Fläche A₁</text>
        <text x="520" y="575" className="area-label">Fläche A₂</text>
      </>}
      {layers.foci && <>
        <circle cx={sunX} cy={cy} r="24" fill="url(#sun)" className="sun-halo" />
        <circle cx={sunX} cy={cy} r="10" className="sun-core" />
        <text x={sunX-20} y={cy+42} className="sun-label">Sonne</text>
      </>}
      {layers.ellipse && <><circle cx={px} cy={py} r="9" className="planet-dot" /><circle cx={px} cy={py} r="17" className="planet-halo" /></>}
      {layers.axes && <>
        <text x={periX-48} y={cy-18} className="point-label perihel-label">Perihel</text>
        <text x={aphelX-30} y={cy-18} className="point-label aphel-label">Aphel</text>
      </>}
      {playing && layers.distances && <g className="motion-dots" />}
    </svg>
  )
}

function ThirdLawScene({ planetIndex }) {
  const planets = [
    ['Merkur', .387, .24], ['Venus', .723, .62], ['Erde', 1, 1],
    ['Mars', 1.524, 1.88], ['Jupiter', 5.203, 11.86]
  ]
  const left = 110
  const right = 860
  const top = 105
  const bottom = 610
  const maxA = 5.5
  const maxT = 12
  const x = (r) => left + (r / maxA) * (right-left)
  const y = (t) => bottom - (t / maxT) * (bottom-top)
  const curve = Array.from({length: 51}, (_,i) => {
    const r = i * maxA / 50
    return `${i === 0 ? 'M' : 'L'} ${x(r)} ${y(Math.sqrt(r*r*r))}`
  }).join(' ')

  return (
    <svg className="third-scene" viewBox="0 0 1000 740" role="img" aria-label="Drittes Keplersches Gesetz">
      {[0,2,4,6,8,10,12].map(t => <line key={`h${t}`} x1={left} x2={right} y1={y(t)} y2={y(t)} className="chart-grid" />)}
      {[0,1,2,3,4,5].map(r => <line key={`v${r}`} x1={x(r)} x2={x(r)} y1={top} y2={bottom} className="chart-grid" />)}
      <line x1={left} x2={right} y1={bottom} y2={bottom} className="chart-axis" />
      <line x1={left} x2={left} y1={top} y2={bottom} className="chart-axis" />
      <path d={curve} className="curve-line" />
      {planets.map(([name,r,t],i) => (
        <g key={name} className={planetIndex === i ? 'chart-point active' : 'chart-point'}>
          <circle cx={x(r)} cy={y(t)} r={planetIndex === i ? 11 : 7} />
          <text x={x(r)+14} y={y(t)-12}>{name}</text>
        </g>
      ))}
      <text x="430" y="688" className="axis-label">Große Halbachse a / AE</text>
      <text x="28" y="380" transform="rotate(-90 28 380)" className="axis-label">Umlaufzeit T / Jahre</text>
    </svg>
  )
}

function FirstLawScene({ eccentricity, layers }) {
  const cx = 500
  const cy = 370
  const a = 330
  const b = a * Math.sqrt(1 - eccentricity * eccentricity)
  const c = a * eccentricity
  return (
    <svg className="ellipse-scene" viewBox="0 0 1000 740" role="img" aria-label="Ellipse mit Brennpunkten">
      {layers.ellipse && <ellipse cx={cx} cy={cy} rx={a} ry={b} className="orbit-line" />}
      {layers.axes && <>
        <line x1={cx-a} y1={cy} x2={cx+a} y2={cy} className="axis-line" />
        <line x1={cx} y1={cy-b} x2={cx} y2={cy+b} className="axis-line" />
        <line x1={cx} y1={cy+28} x2={cx+a} y2={cy+28} className="axis-line major-axis-marker" />
        <text x={cx+a/2} y={cy+18} textAnchor="middle" className="area-label">a = große Halbachse</text>
        <text x={cx+18} y={cy-b/2} className="area-label">b = kleine Halbachse</text>
      </>}
      {layers.foci && <>
        <circle cx={cx-c} cy={cy} r="16" className="sun-core" />
        <circle cx={cx+c} cy={cy} r="7" className="focus-dot" />
        <text x={cx-c-75} y={cy+55} className="point-label">F₁ — Sonne</text>
        <text x={cx+c-18} y={cy+55} className="point-label">F₂</text>
      </>}
      {layers.distances && <text x={cx-a/2} y={cy+95} className="formula-label">r₁ + r₂ = 2a</text>}
      {layers.eccentricity && <text x={cx-a/2} y={cy+125} className="formula-label">e = c/a = {eccentricity.toFixed(2)}</text>}
    </svg>
  )
}

function EllipseBasicsScene({ eccentricity, layers }) {
  const cx = 500
  const cy = 370
  const a = 330
  const b = a * Math.sqrt(1 - eccentricity * eccentricity)
  const c = a * eccentricity
  const pointAngle = -0.72
  const px = cx + a * Math.cos(pointAngle)
  const py = cy + b * Math.sin(pointAngle)

  return (
    <svg className="ellipse-scene" viewBox="0 0 1000 740" role="img" aria-label="Ellipse mit einzeln einblendbaren Bestandteilen">
      {layers.ellipse && <ellipse cx={cx} cy={cy} rx={a} ry={b} className="orbit-line ellipse-main" />}
      {layers.axes && <>
        <line x1={cx-a} y1={cy} x2={cx+a} y2={cy} className="axis-line" />
        <line x1={cx} y1={cy-b} x2={cx} y2={cy+b} className="axis-line" />
        <text x={cx+a/2} y={cy-18} className="axis-label">a — große Halbachse</text>
        <text x={cx+15} y={cy-b/2} className="axis-label">b — kleine Halbachse</text>
      </>}
      {layers.distances && <>
        <line x1={cx-c} y1={cy} x2={px} y2={py} className="focus-distance focus-one" />
        <line x1={cx+c} y1={cy} x2={px} y2={py} className="focus-distance focus-two" />
        <circle cx={px} cy={py} r="8" className="point-on-ellipse" />
        <text x={px+12} y={py-10} className="point-label">Punkt P</text>
        <text x={cx-c/2} y={cy+92} className="axis-label">c — Brennpunktabstand</text>
        <text x={cx-a/2} y={cy+b+65} className="formula-label">r₁ + r₂ = 2a</text>
      </>}
      {layers.foci && <>
        <circle cx={cx-c} cy={cy} r="9" className="focus-dot focus-dot-one" />
        <circle cx={cx+c} cy={cy} r="9" className="focus-dot focus-dot-two" />
        <text x={cx-c-30} y={cy+48} className="point-label">Brennpunkt F₁</text>
        <text x={cx+c-42} y={cy+48} className="point-label">Brennpunkt F₂</text>
      </>}
      {layers.eccentricity && <>
        <text x={cx-a/2} y={cy+b+95} className="area-label">e = c/a = {eccentricity.toFixed(2)}</text>
        <g className="dimension-brackets">
          <line x1={cx-a} y1={cy+b+40} x2={cx+a} y2={cy+b+40} />
          <line x1={cx-a} y1={cy+b+34} x2={cx-a} y2={cy+b+46} />
          <line x1={cx+a} y1={cy+b+34} x2={cx+a} y2={cy+b+46} />
        </g>
      </>}
    </svg>
  )
}

function SeasonsScene({ day }) {
  const cx = 500
  const cy = 370
  const a = 330
  const b = 275
  const c = 180
  const sunX = cx-c
  const angle = Math.PI + (day/365)*Math.PI*2
  const px = cx+a*Math.cos(angle)
  const py = cy+b*Math.sin(angle)
  const seasons = [
    { name:'Frühling', start:79, end:172, color:'#63c98a' },
    { name:'Sommer', start:172, end:266, color:'#efb152' },
    { name:'Herbst', start:266, end:355, color:'#c58a57' },
    { name:'Winter', start:355, end:79, color:'#7aa7d9' },
  ]
  const current = day >= 79 && day < 172 ? seasons[0] : day >= 172 && day < 266 ? seasons[1] : day >= 266 && day < 355 ? seasons[2] : seasons[3]

  return (
    <svg className="ellipse-scene" viewBox="0 0 1000 740" role="img" aria-label="Jahreszeiten und Erdumlaufbahn">
      <ellipse cx={cx} cy={cy} rx={a} ry={b} className="orbit-line" />
      <circle cx={sunX} cy={cy} r="24" fill="#ffc94a" className="sun-halo" />
      <circle cx={sunX} cy={cy} r="10" className="sun-core" />
      <circle cx={px} cy={py} r="10" fill="#75a8ef" stroke="#dceaff" strokeWidth="3" />
      <line x1={sunX} y1={cy} x2={px} y2={py} stroke="#efb152" strokeWidth="1.5" opacity=".7" />
      <text x={sunX-24} y={cy+52} className="sun-label">Sonne</text>
      <text x="170" y="372" className="point-label perihel-label">Perihel · Jan.</text>
      <text x="705" y="372" className="point-label aphel-label">Aphel · Juli</text>
      <g className="season-markers">
        <circle cx={cx+a*Math.cos(Math.PI+(79/365)*Math.PI*2)} cy={cy+b*Math.sin(Math.PI+(79/365)*Math.PI*2)} r="7" fill="#63c98a" />
        <circle cx={cx+a*Math.cos(Math.PI+(172/365)*Math.PI*2)} cy={cy+b*Math.sin(Math.PI+(172/365)*Math.PI*2)} r="7" fill="#efb152" />
        <circle cx={cx+a*Math.cos(Math.PI+(266/365)*Math.PI*2)} cy={cy+b*Math.sin(Math.PI+(266/365)*Math.PI*2)} r="7" fill="#c58a57" />
        <circle cx={cx+a*Math.cos(Math.PI+(355/365)*Math.PI*2)} cy={cy+b*Math.sin(Math.PI+(355/365)*Math.PI*2)} r="7" fill="#7aa7d9" />
      </g>
      <text x={px+14} y={py-18} className="season-current" style={{fill: current.color}}>{current.name}</text>
    </svg>
  )
}

function App() {
  const [law, setLaw] = useState(0)
  const [eccentricity, setEccentricity] = useState(.35)
  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState(.35)
  const [planetIndex, setPlanetIndex] = useState(2)
  const [ellipseLayers, setEllipseLayers] = useState({ ellipse: true, foci: true, axes: true, distances: true, eccentricity: true, areas: true })
  const [day, setDay] = useState(0)
  const [seasonDay, setSeasonDay] = useState(172)
  const [thirdMode, setThirdMode] = useState('graph')

  useEffect(() => {
    if (!playing) return
    let frame
    let last = performance.now()
    const tick = now => {
      const delta = Math.min((now-last)/1000, .05)
      last = now
      setPhase(value => {
        const a = 330
        const b = a * Math.sqrt(1 - eccentricity * eccentricity)
        const c = a * eccentricity
        const x = a * Math.cos(value)
        const y = b * Math.sin(value)
        const distance = Math.sqrt((x + c) * (x + c) + y * y)
        const perihelDistance = a - c
        const speedFactor = Math.pow(perihelDistance / Math.max(distance, 1), 2)
        return value + delta * (.28 + eccentricity * .12) * (1 + 1.8 * speedFactor)
      })
      setDay(d => (d + 1) % 365)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, eccentricity])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.()
    else await document.exitFullscreen?.()
  }

  const planet = ['Merkur','Venus','Erde','Mars','Jupiter'][planetIndex]

  return (
    <main className="presentation">
      <header className="law-header">
        <nav className="law-tabs" aria-label="Keplersche Gesetze">
          {laws.map((label,index) => (
            <button key={label} className={law === index ? 'active' : ''} onClick={() => setLaw(index)}>{label}</button>
          ))}
        </nav>
        <button className="record-button" onClick={toggleFullscreen} title="Vollbild umschalten"><span className="camera-icon">◉</span> Vollbild <span className="expand-icon">↗</span></button>
      </header>

      <section className="stage">
        {law === 0 && (
          <>
            <aside className="info-card"><span className="card-index">Grundlagen</span><h2>Die Bestandteile einer Ellipse</h2><p>Die große Halbachse a bestimmt die Länge, die kleine Halbachse b die Breite. Die Brennpunkte liegen auf der Hauptachse.</p></aside>
            <div className="visual-stage"><EllipseBasicsScene eccentricity={eccentricity} layers={ellipseLayers} /></div>
            <aside className="formula-card ellipse-formulas"><span>Bestandteile</span><b>a · große Halbachse</b><b>b · kleine Halbachse</b><small>c · Brennpunktabstand<br />e = c/a · Exzentrizität</small></aside>
          </>
        )}
        {law === 1 && (
          <>
            <aside className="info-card"><span className="card-index">01</span><h2>Erstes Keplersches Gesetz</h2><p>Die Bahnen der Planeten sind Ellipsen, in deren einem Brennpunkt die Sonne steht.</p></aside>
            <div className="visual-stage"><FirstLawScene eccentricity={eccentricity} layers={ellipseLayers} /></div>
            <aside className="formula-card"><span>Ellipse</span><b>r₁ + r₂ = 2a</b><small>e = c/a</small></aside>
          </>
        )}
        {law === 2 && (
          <>
            <aside className="info-card"><span className="card-index">02</span><h2>Flächensatz (Gleiche Flächen in gleicher Zeit)</h2><p>Der Fahrstrahl überstreicht in gleichen Zeiten gleiche Flächen. Im Perihel läuft der Planet schneller.</p></aside>
            <div className="visual-stage"><EllipseScene eccentricity={eccentricity} playing={playing} phase={phase} layers={ellipseLayers} /></div>
            <aside className="formula-card"><span>Fläche A₁ = Fläche A₂</span><b>v<sub>max</sub> (Perihel) ≈ 1,2x</b><small>v<sub>min</sub> (Aphel) ≈ 0,7x</small></aside>
          </>
        )}
        {law === 3 && (
          <>
            <aside className="info-card"><span className="card-index">Jahreszeiten</span><h2>Nicht gleich lange Jahreszeiten</h2><p>Die Erde bewegt sich am schnellsten nahe am Perihel im Januar und am langsamsten nahe am Aphel im Juli.</p></aside>
            <div className="visual-stage"><SeasonsScene day={seasonDay} /></div>
            <aside className="formula-card season-summary"><span>Nordhalbkugel</span><b>Sommer länger als Winter</b><small>Sommer: ca. 93 Tage<br />Winter: ca. 89 Tage</small></aside>
          </>
        )}
        {law === 4 && (
          <>
            <aside className="info-card"><span className="card-index">03</span><h2>{thirdMode === 'graph' ? 'Die Harmonie der Planetenbahnen' : 'Die Bestandteile der Formel an der Ellipse'}</h2><p>{thirdMode === 'graph' ? 'Je größer die große Halbachse, desto länger die Umlaufzeit.' : 'Die Umlaufzeit T gehört zur Bewegung auf der Bahn. Die große Halbachse a bestimmt die Bahngröße.'}</p></aside>
            <div className="visual-stage">
              {thirdMode === 'graph' && <ThirdLawScene planetIndex={planetIndex} />}
              {thirdMode === 'formula' && <OrbitFormulaScene planetIndex={planetIndex} />}
            </div>
            {thirdMode === 'formula' ? null : (
              <aside className="formula-card"><span>{planet}</span><b>T² / a³ = konstant</b><small>Für die Sonne: T² = a³</small></aside>
            )}
          </>
        )}

        {(law === 1 || law === 2) && (
          <div className="transport">
            <button className="play-button" onClick={() => setPlaying(v => !v)} aria-label={playing ? 'Pause' : 'Start'}>{playing ? 'Ⅱ' : '▶'}</button>
            <button className="reset-button" onClick={() => setPhase(.35)} aria-label="Zurücksetzen">↻</button>
          </div>
        )}
      </section>

      <footer className="control-bar">
        {law === 4 ? (
          <div className="third-law-controls">
            <div className="mode-controls">
              <button className={thirdMode === 'graph' ? 'active' : ''} onClick={() => setThirdMode('graph')}>Grafik</button>
              <button className={thirdMode === 'formula' ? 'active' : ''} onClick={() => setThirdMode('formula')}>An der Ellipse</button>
            </div>
            <div className="planet-controls compact-planets">{['Merkur','Venus','Erde','Mars','Jupiter'].map((name,i)=><button key={name} className={planetIndex === i ? 'active' : ''} onClick={() => setPlanetIndex(i)}>{name}</button>)}</div>
          </div>
        ) : law === 3 ? (
          <div className="eccentricity-control season-control"><div className="control-title"><strong>Tag im Jahr</strong><output>{seasonDay} / 365</output></div><input type="range" min="1" max="365" step="1" value={seasonDay} onChange={event => setSeasonDay(Number(event.target.value))} /></div>
        ) : law === 0 || law === 1 || law === 2 ? (
          law === 0 ? (
            <div className="ellipse-control-panel">
              <div className="ellipse-toggles">
                {[['ellipse','Ellipse'],['foci','Brennpunkte'],['axes','Halbachsen'],['distances','Abstände r₁/r₂'],['eccentricity','Exzentrizität'],['areas','Flächen']].map(([key,label]) => (
                  <button key={key} className={ellipseLayers[key] ? 'active' : ''} onClick={() => setEllipseLayers(v => ({...v,[key]: !v[key]}))}>{label}</button>
                ))}
                <button className="reset-layers" onClick={() => setEllipseLayers({ ellipse: true, foci: true, axes: true, distances: true, eccentricity: true, areas: true })}>Alle einblenden</button>
              </div>
              <div className="eccentricity-control compact"><div className="control-title"><strong>Exzentrizität e</strong><output>{eccentricity.toFixed(2)}</output></div><input type="range" min="0.05" max="0.75" step="0.01" value={eccentricity} onChange={event => setEccentricity(Number(event.target.value))} /></div>
            </div>
          ) : (
            <div className="ellipse-control-panel law-ellipse-controls">
              <div className="ellipse-toggles">
                {[['ellipse','Ellipse'],['foci','Sonne & Brennpunkt'],['axes','Halbachsen'],['distances','Abstand'],['eccentricity','Exzentrizität'],['areas','Fläche']].map(([key,label]) => (
                  <button key={key} className={ellipseLayers[key] ? 'active' : ''} onClick={() => setEllipseLayers(v => ({...v,[key]: !v[key]}))}>{label}</button>
                ))}
              </div>
              <div className="eccentricity-control compact"><div className="control-title"><strong>Exzentrizität e</strong><output>{eccentricity.toFixed(2)}</output></div><input type="range" min="0.05" max="0.75" step="0.01" value={eccentricity} onChange={event => setEccentricity(Number(event.target.value))} /></div>
            </div>
          )
        ) : null}
      </footer>
    </main>
  )
}

function FormulaDecompositionScene({ planetIndex }) {
  const planets = [
    ['Merkur', .24, .387], ['Venus', .62, .723], ['Erde', 1, 1],
    ['Mars', 1.88, 1.524], ['Jupiter', 11.86, 5.203]
  ]
  const [name, t, r] = planets[planetIndex]
  const t2 = t * t
  const r3 = r * r * r

  return (
    <svg className="third-scene formula-decomposition" viewBox="0 0 1000 740" role="img" aria-label="Aufteilung der Formel T Quadrat geteilt durch a Kubik">
      <text x="500" y="88" textAnchor="middle" className="formula-heading">T² / a³ = konstant</text>
      <g transform="translate(145 180)">
        <rect x="0" y="0" width="300" height="170" rx="12" className="formula-box numerator" />
        <text x="150" y="55" textAnchor="middle" className="formula-symbol">T²</text>
        <text x="150" y="98" textAnchor="middle" className="formula-subtitle">Umlaufzeit zum Quadrat</text>
        <text x="150" y="135" textAnchor="middle" className="formula-value">{t}² = {t2.toFixed(2)}</text>
      </g>
      <text x="500" y="280" textAnchor="middle" className="division-symbol">÷</text>
      <g transform="translate(555 180)">
        <rect x="0" y="0" width="300" height="170" rx="12" className="formula-box denominator" />
        <text x="150" y="55" textAnchor="middle" className="formula-symbol">a³</text>
        <text x="150" y="98" textAnchor="middle" className="formula-subtitle">Halbachse hoch drei</text>
        <text x="150" y="135" textAnchor="middle" className="formula-value">{r}³ = {r3.toFixed(2)}</text>
      </g>
      <line x1="240" y1="430" x2="760" y2="430" className="division-arrow" />
      <polygon points="760,430 746,422 746,438" className="division-arrow-head" />
      <g transform="translate(340 470)">
        <rect x="0" y="0" width="320" height="150" rx="12" className="formula-box result" />
        <text x="160" y="45" textAnchor="middle" className="formula-subtitle">Ergebnis für {name}</text>
        <text x="160" y="92" textAnchor="middle" className="formula-result">{t2.toFixed(2)} / {r3.toFixed(2)}</text>
        <text x="160" y="125" textAnchor="middle" className="formula-result-label">≈ 1 · für alle Planeten gleich</text>
      </g>
    </svg>
  )
}

function OrbitFormulaScene({ planetIndex }) {
  const planets = [
    ['Merkur', .24, .387], ['Venus', .62, .723], ['Erde', 1, 1],
    ['Mars', 1.88, 1.524], ['Jupiter', 11.86, 5.203]
  ]
  const [name, t, r] = planets[planetIndex]
  const cx = 500
  const cy = 410
  const a = 270
  const b = 180
  const sunX = cx - 95
  const planetX = cx + a
  const t2 = t * t
  const r3 = r * r * r

  return (
    <svg className="third-scene orbit-formula-scene" viewBox="0 0 1000 740" role="img" aria-label="Drittes Keplersches Gesetz an einer Ellipse">
      <ellipse cx={cx} cy={cy} rx={a} ry={b} className="orbit-line" />
      <circle cx={sunX} cy={cy} r="18" className="sun-core" />
      <circle cx={planetX} cy={cy} r="9" className="planet-dot" />
      <line x1={cx} y1={cy} x2={planetX} y2={cy} className="axis-line formula-axis" />
      <text x={cx+a/2} y={cy-18} className="formula-a-label">a · große Halbachse</text>
      <text x={cx} y="205" textAnchor="middle" className="formula-t-label">T · Umlaufzeit für einen Umlauf</text>
      <g transform="translate(80 35)">
        <rect x="0" y="0" width="250" height="110" rx="12" className="formula-box numerator" />
        <text x="125" y="42" textAnchor="middle" className="formula-symbol">T²</text>
        <text x="125" y="78" textAnchor="middle" className="formula-subtitle">Umlaufzeit zum Quadrat</text>
      </g>
      <g transform="translate(670 35)">
        <rect x="0" y="0" width="250" height="110" rx="12" className="formula-box denominator" />
        <text x="125" y="42" textAnchor="middle" className="formula-symbol">a³</text>
        <text x="125" y="78" textAnchor="middle" className="formula-subtitle">Halbachse hoch drei</text>
      </g>
      <text x="500" y="125" textAnchor="middle" className="division-symbol">÷</text>
      <g transform="translate(350 610)">
        <rect x="0" y="0" width="300" height="75" rx="12" className="formula-box result" />
        <text x="150" y="30" textAnchor="middle" className="formula-subtitle">{name}</text>
        <text x="150" y="58" textAnchor="middle" className="formula-result">{t2.toFixed(2)} / {r3.toFixed(2)} ≈ 1</text>
      </g>
    </svg>
  )
}

export default App
