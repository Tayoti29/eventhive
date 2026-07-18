import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SuccessBanner from '../components/SuccessBanner'
import { useIsMobile } from '../hooks/useIsMobile'

const allCountries = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
  'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
  'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica',
  'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt',
  'El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon',
  'Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana',
  'Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel',
  'Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos',
  'Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi',
  'Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova',
  'Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands',
  'New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau',
  'Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia',
  'Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Saudi Arabia','Senegal','Serbia','Seychelles',
  'Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain',
  'Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand',
  'Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

const statesByCountry = {
  Nigeria: ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'],
  Ghana: ['Ahafo','Ashanti','Bono','Bono East','Central','Eastern','Greater Accra','North East','Northern','Oti','Savannah','Upper East','Upper West','Volta','Western','Western North'],
  Kenya: ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa','Murang\'a','Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'],
  'South Africa': ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'],
  'United States': ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
  'United Kingdom': ['England','Northern Ireland','Scotland','Wales'],
  Canada: ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Northwest Territories','Nova Scotia','Nunavut','Ontario','Prince Edward Island','Quebec','Saskatchewan','Yukon'],
  Australia: ['Australian Capital Territory','New South Wales','Northern Territory','Queensland','South Australia','Tasmania','Victoria','Western Australia'],
  India: ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'],
  Germany: ['Baden-Württemberg','Bavaria','Berlin','Brandenburg','Bremen','Hamburg','Hesse','Lower Saxony','Mecklenburg-Vorpommern','North Rhine-Westphalia','Rhineland-Palatinate','Saarland','Saxony','Saxony-Anhalt','Schleswig-Holstein','Thuringia'],
  France: ['Auvergne-Rhône-Alpes','Bourgogne-Franche-Comté','Brittany','Centre-Val de Loire','Corsica','Grand Est','Hauts-de-France','Île-de-France','Normandy','Nouvelle-Aquitaine','Occitanie','Pays de la Loire','Provence-Alpes-Côte d\'Azur'],
  Brazil: ['Acre','Alagoas','Amapá','Amazonas','Bahia','Ceará','Espírito Santo','Goiás','Maranhão','Mato Grosso','Mato Grosso do Sul','Minas Gerais','Pará','Paraíba','Paraná','Pernambuco','Piauí','Rio de Janeiro','Rio Grande do Norte','Rio Grande do Sul','Rondônia','Roraima','Santa Catarina','São Paulo','Sergipe','Tocantins'],
  China: ['Anhui','Beijing','Chongqing','Fujian','Gansu','Guangdong','Guangxi','Guizhou','Hainan','Hebei','Heilongjiang','Henan','Hubei','Hunan','Inner Mongolia','Jiangsu','Jiangxi','Jilin','Liaoning','Ningxia','Qinghai','Shaanxi','Shandong','Shanghai','Shanxi','Sichuan','Tianjin','Tibet','Xinjiang','Yunnan','Zhejiang'],
  Pakistan: ['Azad Kashmir','Balochistan','Gilgit-Baltistan','Khyber Pakhtunkhwa','Punjab','Sindh'],
  Indonesia: ['Aceh','Bali','Bangka Belitung','Banten','Bengkulu','Central Java','Central Kalimantan','Central Sulawesi','East Java','East Kalimantan','East Nusa Tenggara','Gorontalo','Jakarta','Jambi','Lampung','Maluku','North Kalimantan','North Maluku','North Sulawesi','North Sumatra','Papua','Riau','Riau Islands','Southeast Sulawesi','South Kalimantan','South Sulawesi','South Sumatra','West Java','West Kalimantan','West Nusa Tenggara','West Papua','West Sulawesi','West Sumatra','Yogyakarta'],
  Tanzania: ['Arusha','Dar es Salaam','Dodoma','Geita','Iringa','Kagera','Katavi','Kigoma','Kilimanjaro','Lindi','Manyara','Mara','Mbeya','Morogoro','Mtwara','Mwanza','Njombe','Pemba North','Pemba South','Pwani','Rukwa','Ruvuma','Shinyanga','Simiyu','Singida','Songwe','Tabora','Tanga','Zanzibar North','Zanzibar South','Zanzibar West'],
  Ethiopia: ['Addis Ababa','Afar','Amhara','Benishangul-Gumuz','Dire Dawa','Gambela','Harari','Oromia','Sidama','Somali','South West Ethiopia','Southern Nations','Tigray'],
  Uganda: ['Bugisu','Buganda','Bunyoro','Busoga','Karamoja','Kigezi','Lango','Acholi','West Nile','Teso'],
  Cameroon: ['Adamawa','Centre','East','Far North','Littoral','North','North West','South','South West','West'],
  Senegal: ['Dakar','Diourbel','Fatick','Kaffrine','Kaolack','Kédougou','Kolda','Louga','Matam','Saint-Louis','Sédhiou','Tambacounda','Thiès','Ziguinchor'],
  'Côte d\'Ivoire': ['Abidjan','Bas-Sassandra','Comoé','Denguélé','Gôh-Djiboua','Lacs','Lagunes','Montagnes','Sassandra-Marahoué','Savanes','Vallée du Bandama','Woroba','Yamoussoukro','Zanzan'],
}

function passwordValid(p) {
  return p.length >= 8 && p.length <= 16 && /[A-Z]/.test(p) && /[^A-Za-z0-9]/.test(p) && /[0-9]/.test(p)
}

function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setMockUser } = useAuth()
  const isMobile = useIsMobile()
  const backgroundLocation = location.state?.backgroundLocation

  const [phase, setPhase] = useState('choose')
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showPasswordRules, setShowPasswordRules] = useState(false)
  const [googleHovered, setGoogleHovered] = useState(false)
  const [emailHovered, setEmailHovered] = useState(false)

  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', country: '', state: '', city: '', email: '', password: '', confirmPassword: '' })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleClose = () => {
    if (backgroundLocation) navigate(backgroundLocation.pathname + (backgroundLocation.search || ''))
    else navigate('/')
  }

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (field === 'country') setForm((prev) => ({ ...prev, country: value, state: '', city: '' }))
  }

  const availableStates = statesByCountry[form.country] || []

  const validateForm = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!form.username.trim()) newErrors.username = 'Username is required'
    if (!form.country) newErrors.country = 'Country is required'
    if (!form.state.trim()) newErrors.state = 'State is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Valid email is required'
    if (!passwordValid(form.password)) newErrors.password = 'Password does not meet requirements'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailRegister = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      const { supabase } = await import('../supabaseClient')
      const { error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.firstName + ' ' + form.lastName, first_name: form.firstName, last_name: form.lastName, username: form.username, country: form.country, state: form.state, city: form.city } },
      })
      if (error) console.log('Supabase register failed, using mock:', error.message)
    } catch (err) { console.log('Using mock registration') }

    sessionStorage.setItem('registrationData', JSON.stringify({
      firstName: form.firstName, lastName: form.lastName, username: form.username,
      email: form.email, country: form.country, state: form.state, city: form.city,
    }))

    setLoading(false)
    setPhase('otp')
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) document.getElementById('otp-' + (index + 1))?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) document.getElementById('otp-' + (index - 1))?.focus()
  }

  const handleVerifyOtp = () => {
    const code = otp.join('')
    if (code.length < 6) return
    setMockUser(form.email)
    const mockUser = {
      id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      }),
      email: form.email,
      user_metadata: { full_name: form.firstName + ' ' + form.lastName, first_name: form.firstName, last_name: form.lastName, username: form.username, country: form.country, state: form.state, city: form.city, avatar_url: null },
    }
    sessionStorage.setItem('mockUser', JSON.stringify(mockUser))
    setShowSuccess(true)
  }

  const handleGoogleRegister = async () => {
    try {
      const { supabase } = await import('../supabaseClient')
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
    } catch (err) { console.log('Google OAuth not available') }
  }

  const inputStyle = { width: '100%', height: isMobile ? '48px' : '52px', borderRadius: '12px', border: '1px solid #E8E8EA', padding: '0 16px', fontSize: isMobile ? '15px' : '16px', color: '#414143', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
  const labelStyle = { fontSize: isMobile ? '14px' : '16px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '8px' }
  const errorStyle = { fontSize: '12px', color: '#AE2012', marginTop: '4px', display: 'block' }

  const pwRules = [
    { label: '8–16 characters', ok: form.password.length >= 8 && form.password.length <= 16 },
    { label: '1 capital letter', ok: /[A-Z]/.test(form.password) },
    { label: '1 special character', ok: /[^A-Za-z0-9]/.test(form.password) },
    { label: '1 digit', ok: /[0-9]/.test(form.password) },
  ]

  const choosePhaseW = isMobile ? '100%' : '449px'
  const emailPhaseW = isMobile ? '100%' : '560px'

  return (
    <>
      {showSuccess && <SuccessBanner message="Account created successfully! Welcome to EventHive 🎉" onDone={handleClose} />}

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,12,20,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px' : 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}>

        {phase === 'choose' && (
          <div style={{ width: choosePhaseW, backgroundColor: '#FFFFFF', borderRadius: '24px', padding: isMobile ? '28px 24px' : '40px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <button onClick={handleClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#7E7E82', fontSize: '20px' }}>✕</button>
            <h2 style={{ fontSize: isMobile ? '24px' : '32px', lineHeight: isMobile ? '30px' : '39px', fontWeight: '700', color: '#141415', textAlign: 'center', marginBottom: isMobile ? '28px' : '40px', marginTop: '16px' }}>
              Create your EventHive Account
            </h2>
            <button onClick={handleGoogleRegister}
              onMouseEnter={() => setGoogleHovered(true)} onMouseLeave={() => setGoogleHovered(false)}
              style={{ width: '100%', height: isMobile ? '48px' : '52px', borderRadius: '12px', border: '1px solid #E8E8EA', backgroundColor: googleHovered ? '#EFF9FF' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#141415' }}>Sign up with Google</span>
            </button>
            <button onClick={() => setPhase('email')}
              onMouseEnter={() => setEmailHovered(true)} onMouseLeave={() => setEmailHovered(false)}
              style={{ width: '100%', height: isMobile ? '48px' : '52px', borderRadius: '12px', border: '1px solid #E8E8EA', backgroundColor: emailHovered ? '#EFF9FF' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: isMobile ? '24px' : '32px', transition: 'all 0.2s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414143" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#141415' }}>Sign up with Email</span>
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#7E7E82', margin: 0 }}>
              Already have an account?{' '}
              <span onClick={() => navigate('/login', { state: { backgroundLocation: backgroundLocation || location } })} style={{ color: '#007ACC', cursor: 'pointer', fontWeight: '500' }}>Log In</span>
            </p>
          </div>
        )}

        {phase === 'email' && (
          <div style={{ width: emailPhaseW, maxHeight: '90vh', backgroundColor: '#FFFFFF', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '20px 24px' : '24px 40px', borderBottom: '1px solid #E8E8EA' }}>
              <button onClick={() => { setPhase('choose'); setErrors({}) }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                <span style={{ fontSize: '14px', color: '#59595C' }}>Back</span>
              </button>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#141415', margin: 0 }}>Create Account</h3>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7E7E82', fontSize: '20px' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', padding: isMobile ? '24px' : '32px 40px', flex: 1 }}>
              <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 1fr', gap: isMobile ? '16px' : '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} style={{ ...inputStyle, borderColor: errors.firstName ? '#AE2012' : '#E8E8EA' }} />
                  {errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} style={{ ...inputStyle, borderColor: errors.lastName ? '#AE2012' : '#E8E8EA' }} />
                  {errors.lastName && <span style={errorStyle}>{errors.lastName}</span>}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Username *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#A5A5AA', fontSize: '16px' }}>@</span>
                  <input type="text" placeholder="yourusername" value={form.username} onChange={(e) => set('username', e.target.value.replace(/\s/g, '').toLowerCase())} style={{ ...inputStyle, paddingLeft: '32px', borderColor: errors.username ? '#AE2012' : '#E8E8EA' }} />
                </div>
                {errors.username && <span style={errorStyle}>{errors.username}</span>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Country *</label>
                <select value={form.country} onChange={(e) => { setForm((prev) => ({ ...prev, country: e.target.value, state: '', city: '' })); if (errors.country) setErrors((prev) => ({ ...prev, country: '' })) }} style={{ ...inputStyle, cursor: 'pointer', borderColor: errors.country ? '#AE2012' : '#E8E8EA' }}>
                  <option value="">Select your country</option>
                  {allCountries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <span style={errorStyle}>{errors.country}</span>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>State / Province *</label>
                {availableStates.length > 0 ? (
                  <select value={form.state} onChange={(e) => set('state', e.target.value)} style={{ ...inputStyle, cursor: 'pointer', borderColor: errors.state ? '#AE2012' : '#E8E8EA' }} disabled={!form.country}>
                    <option value="">Select your state</option>
                    {availableStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder={form.country ? 'Enter your state / province' : 'Select a country first'} value={form.state} onChange={(e) => set('state', e.target.value)} disabled={!form.country} style={{ ...inputStyle, borderColor: errors.state ? '#AE2012' : '#E8E8EA', backgroundColor: !form.country ? '#F9F9F9' : '#FFFFFF' }} />
                )}
                {errors.state && <span style={errorStyle}>{errors.state}</span>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>City *</label>
                <input type="text" placeholder={form.country ? 'Enter your city' : 'Select a country first'} value={form.city} onChange={(e) => set('city', e.target.value)} disabled={!form.country} style={{ ...inputStyle, borderColor: errors.city ? '#AE2012' : '#E8E8EA', backgroundColor: !form.country ? '#F9F9F9' : '#FFFFFF' }} />
                {errors.city && <span style={errorStyle}>{errors.city}</span>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" placeholder="sample@gmail.com" value={form.email} onChange={(e) => set('email', e.target.value)} style={{ ...inputStyle, borderColor: errors.email ? '#AE2012' : '#E8E8EA' }} />
                {errors.email && <span style={errorStyle}>{errors.email}</span>}
              </div>

              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <label style={labelStyle}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} placeholder="Create password" value={form.password} onChange={(e) => set('password', e.target.value)} onFocus={() => setShowPasswordRules(true)} onBlur={() => setShowPasswordRules(false)} style={{ ...inputStyle, paddingRight: '48px', borderColor: errors.password ? '#AE2012' : '#E8E8EA' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7E7E82' }}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                {errors.password && <span style={errorStyle}>{errors.password}</span>}
                {showPasswordRules && (
                  <div style={{ position: isMobile ? 'static' : 'absolute', top: '80px', left: 0, width: '100%', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E8EA', padding: '16px', zIndex: 100, boxShadow: isMobile ? 'none' : '0 4px 16px rgba(0,0,0,0.1)', marginTop: isMobile ? '8px' : 0, boxSizing: 'border-box' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#59595C', marginBottom: '8px' }}>Password must contain:</p>
                    {pwRules.map((rule) => (
                      <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: rule.ok ? '#4CAF50' : '#A5A5AA' }}>{rule.ok ? '✓' : '○'}</span>
                        <span style={{ fontSize: '12px', color: rule.ok ? '#4CAF50' : '#A5A5AA' }}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} style={{ ...inputStyle, paddingRight: '48px', borderColor: errors.confirmPassword ? '#AE2012' : '#E8E8EA' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7E7E82' }}>
                    {showConfirm ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}
              </div>

              <button onClick={handleEmailRegister} disabled={loading} style={{ width: '100%', height: isMobile ? '52px' : '56px', borderRadius: '12px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '24px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '12px', color: '#7E7E82', margin: 0 }}>
                Already have an account?{' '}
                <span onClick={() => navigate('/login', { state: { backgroundLocation: backgroundLocation || location } })} style={{ color: '#007ACC', cursor: 'pointer', fontWeight: '500' }}>Log In</span>
              </p>
            </div>
          </div>
        )}

        {phase === 'otp' && (
          <div style={{ width: choosePhaseW, backgroundColor: '#FFFFFF', borderRadius: '24px', padding: isMobile ? '28px 24px' : '40px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '24px' : '32px' }}>
              <button onClick={() => setPhase('email')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                <span style={{ fontSize: '14px', color: '#59595C' }}>Back</span>
              </button>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7E7E82', fontSize: '20px' }}>✕</button>
            </div>

            <h3 style={{ fontSize: isMobile ? '24px' : '32px', lineHeight: isMobile ? '30px' : '39px', fontWeight: '700', color: '#141415', textAlign: 'center', marginBottom: '12px' }}>Verify your Email</h3>
            <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#7E7E82', textAlign: 'center', marginBottom: isMobile ? '24px' : '32px' }}>
              We sent a 6-digit code to <strong style={{ color: '#141415' }}>{form.email}</strong>
            </p>

            <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', justifyContent: 'center', marginBottom: isMobile ? '24px' : '32px' }}>
              {otp.map((digit, i) => (
                <input key={i} id={'otp-' + i} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  style={{ width: isMobile ? '42px' : '52px', height: isMobile ? '50px' : '60px', borderRadius: '12px', textAlign: 'center', border: '1px solid ' + (digit ? '#0097FF' : '#E8E8EA'), fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#141415', outline: 'none', boxSizing: 'border-box', backgroundColor: digit ? '#EFF9FF' : '#FFFFFF', transition: 'all 0.2s ease' }} />
              ))}
            </div>

            <button onClick={handleVerifyOtp} disabled={otp.join('').length < 6}
              style={{ width: '100%', height: isMobile ? '52px' : '56px', borderRadius: '12px', border: 'none', backgroundColor: otp.join('').length === 6 ? '#0097FF' : '#C7C7CA', color: '#FFFFFF', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed', marginBottom: '24px' }}>
              Verify & Create Account
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#7E7E82', margin: 0 }}>
              Didn't receive it?{' '}
              <span onClick={() => setOtp(['', '', '', '', '', ''])} style={{ color: '#0097FF', cursor: 'pointer', fontWeight: '500' }}>Resend Code</span>
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default Register