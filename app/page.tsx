'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell, CalendarDays, ChevronRight, ClipboardList, Clock3, Download,
  FileBarChart, History, LocateFixed, MapPin, Menu, Navigation, Plus,
  Recycle, Route, Search, Settings2, Truck, UserRound, X
} from 'lucide-react'

const menu = [
  { id: 'Inicio', icon: Route }, { id: 'Rutas', icon: Navigation },
  { id: 'Puntos de recolección', icon: MapPin }, { id: 'Jornadas', icon: CalendarDays },
  { id: 'Historial', icon: History }, { id: 'Reportes', icon: FileBarChart }, { id: 'Creación de ruta', icon: Route }, { id: 'Registro de punto', icon: Plus },
  { id: 'Notificaciones', icon: Bell }, { id: 'Perfil', icon: UserRound },
]
const routes = [
  { name: 'Ruta Norte', code: 'RT-001', driver: 'Carlos Méndez', truck: 'CAM-042', status: 'En recorrido', start: '07:00', end: '12:30', zones: 8, material: 'Orgánico y reciclable', color: 'green' },
  { name: 'Ruta Centro', code: 'RT-002', driver: 'Laura Torres', truck: 'CAM-018', status: 'Programada', start: '10:30', end: '15:00', zones: 6, material: 'Reciclables', color: 'blue' },
  { name: 'Ruta Sur', code: 'RT-003', driver: 'Andrés Ríos', truck: 'CAM-027', status: 'Completada', start: '06:30', end: '11:00', zones: 9, material: 'Mixto', color: 'amber' },
]
const points = [
  { name: 'Centro Histórico', address: 'Cra. 7 #12-18', route: 'Ruta Norte', time: '09:30', type: 'Orgánico', status: 'Próximo', distance: '0.8 km' },
  { name: 'La Floresta', address: 'Calle 14 #8-22', route: 'Ruta Norte', time: '10:15', type: 'Reciclable', status: 'Programado', distance: '1.4 km' },
  { name: 'San Martín', address: 'Av. Libertad #32-05', route: 'Ruta Centro', time: '11:00', type: 'Mixto', status: 'Programado', distance: '2.1 km' },
  { name: 'Parque Central', address: 'Calle 10 con Cra. 5', route: 'Ruta Centro', time: '11:45', type: 'Reciclable', status: 'Atendido', distance: '2.8 km' },
  { name: 'Barrio La Esperanza', address: 'Cra. 18 #6-25', route: 'Ruta Sur', time: '12:30', type: 'Orgánico', status: 'Programado', distance: '3.6 km' },
]

function MapDemo({ progress }: { progress: number }) {
  const points = [{ x: 14, y: 63 }, { x: 30, y: 63 }, { x: 48, y: 36 }, { x: 68, y: 36 }, { x: 80, y: 57 }]
  const segment = Math.min(3, Math.floor(progress * 4))
  const local = (progress * 4) % 1
  const left = points[segment].x + (points[segment + 1].x - points[segment].x) * local
  const top = points[segment].y + (points[segment + 1].y - points[segment].y) * local
  return <div className="map-demo live-map"><div className="map-label label-north">N</div><div className="map-zoom"><button aria-label="Acercar mapa">+</button><button aria-label="Alejar mapa">−</button></div><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-road road-four" /><div className="map-road road-five" /><div className="map-road road-six" /><span className="street-name street-one">Av. Libertad</span><span className="street-name street-two">Calle 14</span><span className="street-name street-three">Carrera 7</span><div className="map-block block-one" /><div className="map-block block-two" /><div className="map-block block-three" /><div className="map-block block-four" /><div className="street-route"><span className="route-segment segment-one" /><span className="route-segment segment-two" /><span className="route-segment segment-three" /><span className="route-segment segment-four" /></div><div className="turn-label turn-one">Gira a la derecha</div><div className="turn-label turn-two">Continúa por Av. Libertad</div><div className="route-stop stop-a"><span>1</span><small>Inicio</small></div><div className="route-stop stop-b"><span>2</span><small>Centro</small></div><div className="route-stop stop-c"><span>3</span><small>Próximo</small></div><div className="active-stop-label">Punto actual</div><span className="map-place place-one">Parque Central</span><span className="map-place place-two">Mercado La 14</span><span className="map-place place-three">La Floresta</span><div className="map-pin pin-user"><LocateFixed /></div><div className="map-pin pin-stop stop-one"><MapPin /></div><div className="map-pin pin-stop stop-two"><MapPin /></div><div className="truck-marker" style={{ left: `${left}%`, top: `${top}%` }}><div className="truck-pulse" /><Truck /><span>CAM-042</span></div><div className="map-controls"><button aria-label="Centrar mapa"><LocateFixed /></button><button aria-label="Capas"><Navigation /></button></div><div className="map-legend"><span><i className="legend-route" /> Ruta activa</span><span><i className="legend-stop" /> Punto de recolección</span></div><div className="live-map-badge"><span className="live-dot" /> En vivo · actualizado ahora</div></div>
}

function PageTitle({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) { return <div className="page-title"><div><p className="eyebrow">PANEL DE CONTROL</p><h2>{title}</h2><p>{description}</p></div>{action}</div> }
function Table({ children }: { children: React.ReactNode }) { return <div className="data-table">{children}</div> }

export default function Page() {
  const [loginLoading, setLoginLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [active, setActive] = useState('Inicio de sesión')
  const [progress, setProgress] = useState(.28)
  const [alerts, setAlerts] = useState(true)
  const [toast, setToast] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [pointFilter, setPointFilter] = useState('Todos')
  const lastStop = useRef(-1)
  const beep = () => { const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; const context = new AudioContextClass(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 880; oscillator.type = 'sine'; gain.gain.setValueAtTime(0.08, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.22) }
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  
  const handleRegister = async () => {
    const nombre = authName.trim()
    const correo = authEmail.trim().toLowerCase()

    if (!nombre || !correo || !authPassword) {
      notify('Completa todos los campos.')
      return
    }

    if (nombre.length > 120) {
      notify('El nombre no puede superar los 120 caracteres.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(correo)) {
      notify('Ingresa un correo electrónico válido.')
      return
    }

    if (authPassword.length < 6) {
      notify('La contraseña debe tener mínimo 6 caracteres.')
      return
    }

    setRegisterLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          correo,
          password: authPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        notify(data.message || 'Error al crear la cuenta.')
        return
      }

      setAuthEmail(correo)
      setAuthPassword('')
      setAuthName('')

      notify('¡Cuenta creada correctamente!')

      setTimeout(() => {
        setActive('Inicio de sesión')
      }, 1200)

    } catch (error) {
      console.error('Error al registrar usuario:', error)
      notify('No se pudo conectar con el servidor.')
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleLogin = async () => {
  const correo = authEmail.trim().toLowerCase()

  if (!correo || !authPassword) {
    notify('Ingresa tu correo y contraseña.')
    return
  }

  setLoginLoading(true)

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo,
        password: authPassword,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      notify(data.message || 'No fue posible iniciar sesión.')
      return
    }

    setUserName(data.usuario.nombre)
    setAuthEmail(data.usuario.correo)
    setAuthPassword('')
    setActive('Inicio')

    notify(`¡Bienvenido, ${data.usuario.nombre}!`)

  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    notify('No se pudo conectar con el servidor.')
  } finally {
    setLoginLoading(false)
  }
}

  useEffect(() => { const timer = window.setInterval(() => setProgress(value => { const next = (value + .008) % 1; const stop = Math.floor(next * 4); if (stop !== lastStop.current && next > 0.02) { lastStop.current = stop; beep(); setToast(`Pitido: camión llegó al punto ${stop + 1}`); window.setTimeout(() => setToast(''), 2200) } return next }), 1000); return () => window.clearInterval(timer) }, [])
  const filteredPoints = useMemo(() => points.filter(point => { const matchesSearch = `${point.name} ${point.address} ${point.route} ${point.type}`.toLowerCase().includes(search.toLowerCase()); const matchesFilter = pointFilter === 'Todos' || (pointFilter === 'Próximos' && point.status === 'Próximo') || (pointFilter === 'Atendidos' && point.status === 'Atendido') || (pointFilter === 'Reciclables' && point.type === 'Reciclable'); return matchesSearch && matchesFilter }), [search, pointFilter])

  const renderContent = () => {
    if (active === 'Inicio') return <><section className="hero-card"><div><span className="status-pill"><span className="live-dot" /> Seguimiento en vivo</span><h2>Tu operación de recolección<br /><em>está bajo control</em></h2><p>Consulta recorridos, horarios y alertas desde un solo lugar.</p><button className="primary-button" onClick={() => setActive('Rutas')}><Navigation /> Ver recorridos</button></div><div className="hero-illustration"><div className="sun" /><div className="hill hill-back" /><div className="hill hill-front" /><div className="illustrated-truck"><Truck /></div></div></section><div className="stats-row"><div><span>Rutas activas</span><strong>08</strong><small>+2 esta semana</small></div><div><span>Puntos atendidos</span><strong>124</strong><small>92% completados</small></div><div><span>Material recuperado</span><strong>1.8 t</strong><small>+12.4% mensual</small></div><div><span>Alertas pendientes</span><strong>03</strong><small>Requieren atención</small></div></div><section className="section-heading"><div><h2>Mapa de recorrido</h2><p>Sigue el camión en tiempo real por tu ciudad</p></div><button className="outline-button" onClick={() => notify('Mapa actualizado')}><LocateFixed /> Actualizar</button></section><MapDemo progress={progress} /></>
    if (active === 'Rutas') return <><PageTitle title="Rutas y recorridos" description="Administra los recorridos activos y programados." action={<button className="primary-button" onClick={() => notify('Nueva ruta lista para configurar')}><Plus /> Nueva ruta</button>} /><div className="route-summary"><div><Route /><span>Recorridos hoy<strong>12</strong></span></div><div><Truck /><span>Camiones activos<strong>08</strong></span></div><div><MapPin /><span>Zonas cubiertas<strong>42</strong></span></div></div><div className="route-cards">{routes.map(route => <button key={route.code} className="route-card" onClick={() => notify(`${route.name} seleccionada`)}><div className={`route-badge ${route.color}`}><Route /></div><div className="route-card-main"><div className="route-card-head"><strong>{route.name}</strong><span className={`status-tag ${route.color}`}>{route.status}</span></div><small>{route.code} · {route.driver} · {route.truck}</small><div className="route-meta"><span><Clock3 /> {route.start} — {route.end}</span><span><MapPin /> {route.zones} zonas</span></div></div><ChevronRight /></button>)}</div><section className="section-heading"><div><h2>Recorrido en vivo · Ruta Norte</h2><p>El camión CAM-042 está avanzando por sus puntos asignados.</p></div></section><MapDemo progress={progress} /></>
    if (active === 'Puntos de recolección') return <><PageTitle title="Puntos de recolección" description="Planifica horarios, materiales y cobertura por zona." action={<button className="primary-button" onClick={() => notify('Formulario de nuevo punto abierto')}><Plus /> Registrar punto</button>} /><div className="points-overview"><div><span className="overview-icon green"><MapPin /></span><div><strong>24</strong><small>Puntos activos</small></div></div><div><span className="overview-icon blue"><Clock3 /></span><div><strong>08:30</strong><small>Primera recolección</small></div></div><div><span className="overview-icon amber"><Recycle /></span><div><strong>3 tipos</strong><small>Materiales recibidos</small></div></div></div><div className="points-toolbar"><div className="toolbar"><div className="search-box"><Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar zona, dirección o ruta..." /></div><button className="outline-button" onClick={() => notify('Mostrando solo puntos activos')}>Activos <span className="filter-count">24</span></button></div><div className="filter-chips">{['Todos', 'Próximos', 'Atendidos', 'Reciclables'].map(filter => <button key={filter} className={`chip ${pointFilter === filter ? 'active' : ''}`} onClick={() => setPointFilter(filter)}>{filter}</button>)}</div></div><div className="point-cards">{filteredPoints.map(point => <button className="point-card" key={point.name} onClick={() => notify(`${point.name}: recolección a las ${point.time}`)}><div className="point-card-top"><span className="point-marker"><MapPin /></span><span className={`status-tag ${point.status === 'Atendido' ? 'blue' : point.status === 'Próximo' ? 'green' : 'amber'}`}>{point.status}</span></div><div className="point-card-body"><strong>{point.name}</strong><span>{point.address}</span><small><Route /> {point.route} <b>·</b> <Clock3 /> Hoy, {point.time} h</small></div><div className="point-card-footer"><span>{point.type}</span><span>{point.distance} <ChevronRight /></span></div></button>)}</div>{filteredPoints.length === 0 && <div className="points-empty"><MapPin /><strong>No encontramos puntos</strong><span>Prueba con otra zona, ruta o material.</span><button className="outline-button" onClick={() => { setSearch(''); setPointFilter('Todos') }}>Limpiar filtros</button></div>}<div className="info-form"><div><h3>¿Necesitas agregar un punto?</h3><p>Registra una nueva ubicación y asígnala a una ruta de recolección.</p></div><button className="outline-button" onClick={() => notify('Registro de punto iniciado')}>Abrir formulario <ChevronRight /></button></div></>
    if (active === 'Creación de ruta') return <><PageTitle title="Creación de ruta" description="Diseña recorridos, agrega paradas y asigna un camión." action={<button className="primary-button" onClick={() => notify('Ruta registrada correctamente')}><Route /> Registrar ruta</button>} /><div className="form-layout"><div className="modern-form"><label>Nombre de la ruta<input defaultValue="Ruta Comuna 9" /></label><label>Camión asignado<select><option>CAM-042 · Isuzu NPR</option><option>CAM-018 · Foton</option></select></label><label>Horario de salida<input type="time" defaultValue="07:00" /></label><label>Descripción<textarea defaultValue="Recorrido de recolección orgánica y reciclable." /></label><button className="primary-button" onClick={() => notify('Cambios guardados')}>Guardar borrador</button></div><div className="stops-panel"><div className="section-heading compact"><div><h2>Paradas del recorrido</h2><p>Ordena los puntos que visitará el camión.</p></div><button className="outline-button" onClick={() => notify('Nueva parada agregada')}><Plus /> Agregar</button></div>{points.slice(0,4).map((point, index) => <div className="stop-row" key={point.name}><span>{index + 1}</span><div><strong>{point.name}</strong><small>{point.address}</small></div><ChevronRight /></div>)}</div></div></>
    if (active === 'Registro de punto') return <><PageTitle title="Registro de punto" description="Agrega una ubicación para ampliar la cobertura de recolección." /><div className="form-layout"><div className="modern-form"><label>Nombre o referencia<input placeholder="Ej. Centro comunitario" /></label><label>Barrio o zona<input placeholder="Ej. La Esperanza" /></label><label>Dirección<input placeholder="Ej. Calle 12 #8-20" /></label><label>Descripción del material<textarea placeholder="Describe el tipo de material y frecuencia." /></label><button className="primary-button" onClick={() => notify('Punto registrado correctamente')}>Agregar punto</button></div><div className="location-card"><MapDemo progress={progress} /><div><strong>Ubicación en mapa</strong><p>Selecciona el punto aproximado del mapa para asociarlo a una ruta.</p></div></div></div></>
    if (active === 'Jornadas') return <><PageTitle title="Registro de jornadas" description="Controla las jornadas realizadas por fecha, ruta y material." /><div className="filter-card"><label>Inicio<input type="date" defaultValue="2026-10-01" /></label><label>Fin<input type="date" defaultValue="2026-10-20" /></label><label>Ruta<select><option>Todas las rutas</option><option>Ruta Norte</option></select></label><button className="primary-button" onClick={() => notify('Jornada guardada')}>Guardar</button></div><Table><div className="table-head"><span>FECHA</span><span>RUTA</span><span>MATERIAL</span><span>CANTIDAD</span><span>OBSERVACIONES</span></div>{['20/10/2026','19/10/2026','18/10/2026','17/10/2026'].map((date, i) => <div className="table-row" key={date}><span>{date}</span><strong>{routes[i % 3].name}</strong><span>{i % 2 ? 'Reciclable' : 'Mixto'}</span><span>{18 + i * 4} kg</span><span>Jornada completada</span></div>)}</Table></>
    if (active === 'Historial') return <><PageTitle title="Historial de recolecciones" description="Consulta el registro histórico de puntos atendidos." /><div className="history-card"><div className="history-chart"><div className="chart-bars"><i style={{height:'45%'}} /><i style={{height:'70%'}} /><i style={{height:'54%'}} /><i style={{height:'88%'}} /><i style={{height:'66%'}} /><i style={{height:'96%'}} /><i style={{height:'78%'}} /></div><div className="chart-labels"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div></div><div className="history-total"><span>Total recuperado</span><strong>1,284 kg</strong><small>+18.6% frente al mes anterior</small></div></div><Table><div className="table-head"><span>FECHA</span><span>LUGAR DE RECOLECCIÓN</span><span>MATERIAL</span><span>CANTIDAD</span><span /></div>{['Centro Histórico','La Floresta','San Martín','Parque Central'].map((point, i) => <div className="table-row" key={point}><span>20/10/2026</span><strong>{point}</strong><span>Orgánico</span><span>{42 + i * 8} kg</span><ChevronRight /></div>)}</Table></>
    if (active === 'Reportes') return <><PageTitle title="Reportes generados" description="Analiza el rendimiento de la operación de recolección." action={<button className="outline-button" onClick={() => notify('Reporte descargado')}><Download /> Descargar PDF</button>} /><div className="report-kpis"><div><span>Jornadas</span><strong>24</strong><small>+8.2%</small></div><div><span>Material recuperado</span><strong>1,284 kg</strong><small>+18.6%</small></div><div><span>Recorridos</span><strong>38</strong><small>+12.1%</small></div></div><div className="report-panel"><div className="section-heading compact"><div><h2>Rendimiento mensual</h2><p>Material recuperado por semana</p></div></div><div className="big-chart"><div className="chart-line" /></div></div></>
    if (active === 'Notificaciones') return <><PageTitle title="Centro de notificaciones" description="Mantente informado sobre recorridos, alertas y novedades." action={<button className={`alert-button ${alerts ? 'enabled' : ''}`} onClick={() => setAlerts(!alerts)}><Bell /> {alerts ? 'Alertas activadas' : 'Activar alertas'}<span className="toggle"><span /></span></button>} /><div className="notification-page-list">{[['El camión se acerca','Ruta Norte está a 1.2 km de Centro Histórico.','Hace 2 min',Truck],['Jornada completada','Se registraron 42 kg en La Floresta.','Hace 18 min',Recycle],['Nueva ruta programada','Ruta Centro inicia hoy a las 10:30 h.','Hace 1 h',CalendarDays]].map(([title, text, time, Icon]) => <div className="notification-page-item" key={String(title)}><span className="notif-icon"><Icon /></span><div><strong>{title}</strong><p>{text}</p><small>{time}</small></div><button onClick={() => notify('Notificación marcada como leída')}>Marcar leída</button></div>)}</div></>
    return <><PageTitle title="Perfil de usuario" description="Administra tus datos y preferencias de la plataforma." /><div className="profile-panel"><div className="profile-large">MG</div><div><h3>María González</h3><p>Coordinadora de operaciones</p><span>maria.gonzalez@r limpia.co</span></div><button className="outline-button" onClick={() => notify('Modo edición activado')}>Editar perfil</button></div><div className="settings-list"><button><UserRound /><span><strong>Información personal</strong><small>Nombre, correo y teléfono</small></span><ChevronRight /></button><button><Bell /><span><strong>Preferencias de alertas</strong><small>Notificaciones de recorridos</small></span><ChevronRight /></button><button><Settings2 /><span><strong>Configuración</strong><small>Zona, idioma y privacidad</small></span><ChevronRight /></button></div></>
  }



  if (['Inicio de sesión', 'Registro', 'Recuperar contraseña'].includes(active)) {
    return (
      <main className="auth-page">
        <div className="auth-brand">
          <div className="brand-mark">
            <Recycle />
          </div>
          <strong>Ruta limpia</strong>
          <span>Gestión inteligente de recolección</span>

          <div className="demo-credentials">
            <strong>Demo disponible</strong>
            <span>Correo: demo@rutalimpia.co</span>
            <span>Contraseña: 123456</span>
          </div>
        </div>

        <div className="auth-card">
          {/* INICIO DE SESIÓN */}
          {active === 'Inicio de sesión' && (
            <>
              <p className="eyebrow">Bienvenido de nuevo</p>
              <h1>Inicia sesión</h1>
              <p className="auth-copy">
                Administra tus rutas, puntos y jornadas desde un solo lugar.
              </p>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="nombre@correo.com"
                  autoComplete="email"
                />
              </label>

              <label>
                Contraseña
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </label>

              <button
                type="button"
                className="primary-button"
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? 'Verificando datos...' : 'Ingresar'}
              </button>

              <button
                className="text-button"
                onClick={() => setActive('Recuperar contraseña')}
              >
                ¿Olvidaste tu contraseña?
              </button>

              <div className="auth-divider">
                <span /> o <span />
              </div>

              <button
                className="outline-button"
                onClick={() => {
                  setAuthName('')
                  setAuthEmail('')
                  setAuthPassword('')
                  setActive('Registro')
                }}
              >
                Crear una cuenta
              </button>
            </>
          )}

          {/* REGISTRO */}
          {active === 'Registro' && (
            <>
              <p className="eyebrow">Comienza ahora</p>
              <h1>Crea tu cuenta</h1>

              <p className="auth-copy">
                Configura tu perfil para organizar tus rutas y jornadas.
              </p>

              <label>
                Nombre completo
                <input
                  type="text"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  placeholder="Ej. Robinson Herrera"
                  maxLength={120}
                  autoComplete="name"
                />
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="nombre@correo.com"
                  maxLength={150}
                  autoComplete="email"
                />
              </label>

              <label>
                Contraseña
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
              </label>

              <button
                className="primary-button"
                onClick={handleRegister}
                disabled={registerLoading}
              >
                {registerLoading ? 'Creando cuenta...' : 'Registrarme'}
              </button>

              <button
                className="text-button"
                onClick={() => setActive('Inicio de sesión')}
                disabled={registerLoading}
              >
                Ya tengo una cuenta
              </button>
            </>
          )}

          {/* RECUPERAR CONTRASEÑA */}
          {active === 'Recuperar contraseña' && (
            <>
              <p className="eyebrow">Acceso seguro</p>
              <h1>Recuperar contraseña</h1>

              <p className="auth-copy">
                Te enviaremos un código de recuperación a tu correo.
              </p>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="nombre@correo.com"
                  autoComplete="email"
                />
              </label>

              <button
                className="primary-button"
                onClick={() =>
                  notify('Módulo de recuperación pendiente de conexión')
                }
              >
                Enviar código
              </button>

              <button
                className="text-button"
                onClick={() => setActive('Inicio de sesión')}
              >
                Volver a iniciar sesión
              </button>
            </>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Recycle />
          </div>

          <div>
            <strong>Ruta limpia</strong>
            <span>Gestión inteligente</span>
          </div>

          <button
            className="close-mobile"
            onClick={() => setMobileMenu(false)}
            aria-label="Cerrar menú"
          >
            <X />
          </button>
        </div>

        <nav className="side-nav" aria-label="Navegación principal">
          {menu.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.id}
                className={active === item.id ? 'active' : ''}
                onClick={() => {
                  setActive(item.id)
                  setMobileMenu(false)
                }}
              >
                <span className="nav-icon">
                  <Icon />
                </span>
                {item.id}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            onClick={() => {
              setAuthEmail('')
              setAuthPassword('')
              setActive('Inicio de sesión')
            }}
          >
            <Settings2 /> Cerrar sesión
          </button>

          <div className="support-card">
            <span className="live-dot" />
            <div>
              <strong>Servicio activo</strong>
              <span>Operando con normalidad</span>
            </div>
          </div>

          <div className="profile">
            <div className="avatar">MG</div>
            <div>
              <strong>María González</strong>
              <span>Coordinadora</span>
            </div>
            <ChevronRight />
          </div>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileMenu(true)}
            aria-label="Abrir menú"
          >
            <Menu />
          </button>

          <div>
            <p className="eyebrow">Martes, 20 de octubre de 2026</p>
            <h1>
              {active === 'Inicio' ? 'Buenos días, María' : active}
            </h1>
          </div>

          <div className="top-actions">
            <button
              className="icon-button"
              onClick={() => setActive('Notificaciones')}
              aria-label="Notificaciones"
            >
              <Bell />
              {alerts && <span className="notification-dot" />}
            </button>

            <div className="top-avatar">MG</div>
          </div>
        </header>

        <div className="content-page">
          {renderContent()}
        </div>

        {toast && (
          <div className="toast">
            <span className="toast-check">✓</span>
            {toast}
          </div>
        )}
      </section>
    </main>
  )
}

