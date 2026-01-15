
## Sección 1: Resolución de problemas

### Pregunta 1: Optimización de Base de Datos con Alto Volumen

**Mi Approach:**

## 1. Diagnóstico Inicial (1-2 días)
- Revisar slow query logs y ejecutar `EXPLAIN ANALYZE` en queries críticos
- Identificar problemas N+1 del ORM
- Monitorear métricas: CPU, RAM, I/O, conexiones activas

## 2. Soluciones Inmediatas (Semana 1)

**Indexación:**
```sql
-- Crear índices en columnas de WHERE, JOIN, ORDER BY
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);
CREATE INDEX idx_composite ON products(category_id, status);
```

**Optimización ORM:**
- Implementar eager loading para evitar N+1
- Usar `.select()` para traer solo campos necesarios
- Paginación en todas las listas
- Batch operations para operaciones masivas

**Caching:**
- Redis para queries frecuentes y datos de sesión
- Cache a nivel de aplicación para datos estáticos

## 3. Mediano Plazo (2-4 semanas)

- **Connection pooling** optimizado
- **Desnormalización selectiva** para queries críticos
- **Materialized views** para reportes/agregaciones
- **Particionamiento** de tablas grandes por fecha
- Reescribir queries complejos con raw SQL cuando el ORM genere queries ineficientes

## 4. Largo Plazo (1-2 meses)

- **Read replicas** para distribución de carga de lectura
- **Database sharding** para tablas críticas si es necesario
- **CQRS:** Separar BD de lectura/escritura
- Mover datos históricos a cold storage
- APM y monitoreo continuo (DataDog/New Relic)

## Plan de Trabajo

| Fase | Timeline | Objetivo |
|------|----------|----------|
| Quick Wins | Semana 1 | -40-60% tiempo de respuesta |
| Optimización | Semana 2-4 | -70% tiempo de respuesta |
| Escalabilidad | Mes 2+ | Sistema preparado para 10x volumen |

**Principios clave:**
- Basarse en métricas reales, no suposiciones
- Testing riguroso en staging antes de producción
- Cada cambio debe tener rollback plan

---

### Pregunta 2: Optimización de Página con Múltiples Fetch()

## Soluciones

### 1. Estrategias de Carga

**Paralelización inteligente:**
```javascript
// ❌ Malo: fetch secuencial
const user = await fetch('/api/user');
const posts = await fetch('/api/posts');
const comments = await fetch('/api/comments');

// ✅ Bueno: fetch paralelo
const [user, posts, comments] = await Promise.all([
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/comments')
]);
```

**Agregación en el backend:**
```javascript
// ✅ Mejor: Un solo endpoint que agrupa datos
const data = await fetch('/api/dashboard-data'); // Devuelve todo junto
```

**Lazy Loading y Code Splitting:**
- Cargar solo componentes visibles en viewport
- `React.lazy()` + `Suspense` o similar en tu framework
- Intersection Observer API para scroll infinito

### 2. Técnicas de Optimización

**Caching:**
- **SWR/React Query:** Cache, revalidación automática, deduplicación
- **Service Workers:** Cache de assets y API responses
- HTTP Cache headers (Cache-Control, ETag)

**Prefetching:**
```javascript
// Precargar datos en hover o idle time
<Link onMouseEnter={() => prefetch('/api/data')} />
```

**Request Deduplication:**
```javascript
// React Query deduplica automáticamente
const { data } = useQuery('users', fetchUsers); // Múltiples componentes, 1 request
```

**Optimistic Updates:**
- Actualizar UI antes de confirmar con el servidor
- Mejor UX percibido

### 3. Tecnologías

| Tecnología | Uso |
|------------|-----|
| **React Query / SWR** | Cache, deduplicación, revalidación automática |
| **GraphQL + Apollo** | Cargar solo campos necesarios, batch requests |
| **Next.js / Remix** | SSR/SSG para primera carga, streaming |
| **Service Workers** | Cache offline, background sync |
| **CDN + Edge Computing** | Cloudflare Workers, Vercel Edge |

### 4. Herramientas de Diagnóstico

**Browser DevTools:**
- **Network tab:** Ver cascada de requests, timing, tamaño
- **Performance tab:** Profiling, identificar long tasks
- **Lighthouse:** Auditoría automática de performance

**Herramientas avanzadas:**
- **Chrome DevTools Performance Insights:** Análisis detallado
- **WebPageTest:** Testing desde múltiples ubicaciones
- **Bundle Analyzer:** Identificar JS bundles grandes
- **React DevTools Profiler:** Renders innecesarios
- **Web Vitals:** Métricas Core Web Vitals (LCP, FID, CLS)

**APM/Monitoring:**
- Sentry Performance
- New Relic Browser
- DataDog RUM

## Approach Práctico

1. **Medir primero:** DevTools Network + Lighthouse
2. **Quick wins:**
   - Implementar Promise.all() para requests paralelos
   - Agregar SWR/React Query para cache
   - Code splitting de rutas
3. **Optimización media:**
   - Backend endpoint agregado
   - Lazy loading de componentes
   - Service Worker para cache
4. **Largo plazo:**
   - SSR/SSG con Next.js
   - GraphQL si hay overfetching significativo
   - Edge caching con CDN

---

### Pregunta 4: Optimización de Costos en Generación de Audio con IA

## Estrategias para Reducir Costos

### 1. Optimización del Texto

**Limitar longitud antes de TTS:**
```javascript
// Limitar palabras en el prompt
prompt: "Explica en máximo 100 palabras para audio..."

// Resumir respuestas largas antes de generar audio
const optimizedText = text.length > 500 
  ? await summarize(text, maxWords: 200) 
  : text;
```

**Limpiar texto innecesario:**
- Eliminar metadata, códigos, referencias
- Usar modelo de resumen económico antes de TTS

### 2. Caching Agresivo

```javascript
// Cache en Redis + almacenamiento permanente
const cacheKey = hash(questionId + answer);
const cached = await redis.get(`audio:${cacheKey}`);
if (cached) return cached; // Evita regenerar

// Almacenar en S3/CDN
await s3.upload({ Key: `audios/${cacheKey}.mp3`, Body: audio });
```

**Pre-generación de FAQs:**
- Identificar preguntas frecuentes
- Pre-generar audios de respuestas comunes
- Reutilizar bloques estándar de explicación

### 3. Cambio de Proveedor TTS

| Proveedor | Costo/1M caracteres | Recomendación |
|-----------|---------------------|---------------|
| Google Cloud TTS | $4 | ✅ Más económico |
| Amazon Polly | $4 | ✅ Buena calidad/precio |
| Azure Speech | $16 | Alta calidad |
| OpenAI TTS | $15 | Caro para volumen |

**Ahorro: ~70% usando Google/Polly vs OpenAI**

### 4. Arquitectura Propuesta

**Flujo optimizado:**
```
Pregunta → Cache Check → [Hit: Devolver audio]
                      ↓ [Miss]
           Resumir si >500 palabras
                      ↓
           TTS (Google/Polly)
                      ↓
           Cache (Redis + S3/CDN)
```

**Chunking inteligente:**
- Respuestas largas dividir en segmentos
- Generar solo el chunk actual bajo demanda
- Streaming para mejor UX

## Resultados Esperados

- **Cache + Pre-gen:** 60-70% reducción
- **Cambio de proveedor:** 70% reducción
- **Resúmenes automáticos:** 40-50% menos tokens
- **Combinado:** 80-90% reducción total de costos

---

### Pregunta 5: Carga Masiva de CSV con Datos Dependientes

## Estrategia de Procesamiento

### 1. Validación Previa (Pre-procesamiento)

**Antes de insertar:**
```javascript
// 1. Validar archivo completo primero
const validation = await validateCSV(file);
if (!validation.isValid) {
  return { 
    error: "Errores encontrados", 
    details: validation.errors 
  };
}

// 2. Verificar dependencias
const dependencyGraph = buildDependencyGraph(records);
if (hasCyclicDependencies(dependencyGraph)) {
  return { error: "Dependencias cíclicas detectadas" };
}
```

**Validaciones clave:**
- Estructura del CSV (columnas correctas)
- Tipos de datos válidos
- Registros duplicados
- Dependencias resolubles (orden correcto)
- Restricciones de negocio

### 2. Procesamiento con Transacciones

**Approach con transacciones y batches:**
```javascript
async function processCSV(file) {
  const records = parseCSV(file);
  const BATCH_SIZE = 1000;
  
  // Ordenar por dependencias
  const sortedRecords = topologicalSort(records);
  
  for (let i = 0; i < sortedRecords.length; i += BATCH_SIZE) {
    const batch = sortedRecords.slice(i, i + BATCH_SIZE);
    
    await db.transaction(async (trx) => {
      try {
        // Procesar batch completo
        for (const record of batch) {
          await insertWithDependencies(record, trx);
        }
        
        // Guardar checkpoint
        await saveProgress(i + batch.length);
        
      } catch (error) {
        // Rollback automático del batch
        throw error;
      }
    });
  }
}
```

### 3. Manejo de Excepciones

**Sistema de checkpoints:**
```javascript
const jobStatus = {
  id: generateJobId(),
  total: records.length,
  processed: 0,
  failed: [],
  status: 'processing'
};

try {
  // Procesar por batches
  for (const batch of batches) {
    await processBatch(batch);
    jobStatus.processed += batch.length;
    await updateJobStatus(jobStatus);
  }
} catch (error) {
  jobStatus.status = 'failed';
  jobStatus.error = error.message;
  await updateJobStatus(jobStatus);
}
```

**Logs detallados:**
```javascript
// Registrar cada error sin detener todo
for (const record of batch) {
  try {
    await insertRecord(record);
  } catch (error) {
    await logError({
      recordId: record.id,
      lineNumber: record.lineNumber,
      error: error.message,
      data: record
    });
    failedRecords.push(record);
  }
}
```

### 4. Manejo de Fallos Después de 10,000 Registros

**Opción A: Rollback completo (datos críticos)**
```javascript
// Todo en una gran transacción
await db.transaction(async (trx) => {
  for (const record of allRecords) {
    await insert(record, trx);
  }
  // Si falla registro 10,001 → rollback automático de todo
});
```
⚠️ **Problema:** Puede ser muy lento y bloquear la BD

**Opción B: Checkpoints + Continuación (RECOMENDADO)**
```javascript
// Guardar progreso cada N registros
const checkpoint = await getLastCheckpoint(jobId);
const startFrom = checkpoint?.lastProcessed || 0;

for (let i = startFrom; i < records.length; i += BATCH_SIZE) {
  await db.transaction(async (trx) => {
    const batch = records.slice(i, i + BATCH_SIZE);
    await processBatch(batch, trx);
    await saveCheckpoint(jobId, i + batch.length);
  });
}

// Si falla: Solo reintenta desde último checkpoint
```

**Opción C: Modo "Best Effort" + Reporte**
```javascript
const results = {
  successful: [],
  failed: [],
  skipped: [] // Por dependencias fallidas
};

for (const record of records) {
  try {
    await insert(record);
    results.successful.push(record.id);
  } catch (error) {
    results.failed.push({ record, error });
    // Marcar dependientes como skipped
    markDependentsAsSkipped(record.id);
  }
}

// Generar reporte CSV con errores para reintentar
await generateErrorReport(results.failed);
```

## Arquitectura Propuesta

```
1. Upload CSV → S3/Storage (async)
2. Trigger background job (Queue: Bull/BullMQ)
3. Worker procesa:
   - Validación completa
   - Ordenamiento por dependencias
   - Procesamiento por batches con transacciones
   - Checkpoints cada N registros
   - Log de errores
4. Notificar usuario: Success/Partial/Failed
5. Generar reporte de errores si hay fallos
```

## Tecnologías Recomendadas

| Herramienta | Uso |
|-------------|-----|
| **Bull/BullMQ** | Queue para jobs async |
| **Papa Parse** | Parseo eficiente de CSV |
| **Database Transactions** | Atomicidad por batch |
| **Redis** | Almacenar checkpoints y status |
| **Streaming** | Procesar archivos grandes sin cargar todo en memoria |

## Consideraciones Importantes

- **Streaming vs In-Memory:** Para archivos >100MB usar streaming
- **Idempotencia:** Permitir reintentos sin duplicar datos
- **Timeouts:** Jobs largos con timeout razonable
- **Notificaciones:** Email/webhook cuando termine el proceso
- **Reporte descargable:** CSV con errores para corrección manual

---

### Pregunta 6: Formulario Reutilizable en Múltiples Páginas

## Estrategia Concreta

### 1. Componente Base con Composición

**Estructura:**
```
components/
  ├── forms/
  │   ├── UserForm.tsx          // Componente principal
  │   ├── useUserForm.ts        // Lógica compartida (hook)
  │   └── userFormSchema.ts     // Validación (Zod/Yup)
  └── pages/
      ├── CreateUser.tsx        // Usa UserForm
      ├── EditUser.tsx          // Usa UserForm
      └── UserProfile.tsx       // Usa UserForm
```

### 2. Implementación

**Hook personalizado (lógica reutilizable):**
```typescript
// useUserForm.ts
export function useUserForm(initialData?: User, onSubmit?: Function) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
    resolver: zodResolver(userSchema)
  });
  
  const submit = async (data) => {
    try {
      await onSubmit?.(data);
      toast.success('Guardado exitosamente');
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return { register, handleSubmit: handleSubmit(submit), errors };
}
```

**Componente reutilizable:**
```typescript
// UserForm.tsx
interface UserFormProps {
  initialData?: User;
  onSubmit: (data: User) => Promise<void>;
  mode?: 'create' | 'edit' | 'view';
  showFields?: string[];  // Control de campos visibles
}

export function UserForm({ 
  initialData, 
  onSubmit, 
  mode = 'create',
  showFields = ['name', 'email', 'role']
}: UserFormProps) {
  const { register, handleSubmit, errors } = useUserForm(initialData, onSubmit);
  const isReadOnly = mode === 'view';
  
  return (
    <form onSubmit={handleSubmit}>
      {showFields.includes('name') && (
        <Input 
          {...register('name')} 
          error={errors.name} 
          disabled={isReadOnly}
        />
      )}
      
      {showFields.includes('email') && (
        <Input 
          {...register('email')} 
          error={errors.email}
          disabled={isReadOnly}
        />
      )}
      
      {showFields.includes('role') && (
        <Select 
          {...register('role')} 
          error={errors.role}
          disabled={isReadOnly}
        />
      )}
      
      {mode !== 'view' && (
        <Button type="submit">
          {mode === 'create' ? 'Crear' : 'Actualizar'}
        </Button>
      )}
    </form>
  );
}
```

### 3. Uso en Diferentes Páginas

```typescript
// CreateUser.tsx
function CreateUserPage() {
  return (
    <UserForm 
      onSubmit={async (data) => await api.createUser(data)}
      mode="create"
    />
  );
}

// EditUser.tsx
function EditUserPage({ userId }) {
  const { data: user } = useQuery(['user', userId], () => api.getUser(userId));
  
  return (
    <UserForm 
      initialData={user}
      onSubmit={async (data) => await api.updateUser(userId, data)}
      mode="edit"
    />
  );
}

// UserProfile.tsx (solo lectura, campos limitados)
function UserProfilePage() {
  const { user } = useAuth();
  
  return (
    <UserForm 
      initialData={user}
      mode="view"
      showFields={['name', 'email']}  // Ocultar campo role
    />
  );
}
```

## Ventajas de este Approach

✅ **Separación de responsabilidades:** Lógica (hook) vs UI (componente)  
✅ **Flexibilidad:** Props para customizar comportamiento  
✅ **Validación centralizada:** Un schema para todo  
✅ **Type-safe:** TypeScript asegura consistencia  
✅ **Testing fácil:** Hook y componente testeables por separado  
✅ **Mantenimiento:** Cambios en un solo lugar

---

### Pregunta 7: Estructura de Frontend Grande para Múltiples Equipos

## Mi Approach: Arquitectura Integrada

> **Nota:** Es una sola estrategia donde cada parte complementa a las demás.

### 1. Nivel Macro: Monorepo con Micro-Frontends

**Estructura del repositorio:**
```
monorepo/
├── apps/                   # Cada equipo tiene su app
│   ├── admin/              
│   ├── customers/          
│   └── analytics/          
├── packages/               # Código compartido entre equipos
│   ├── ui/                 # Design system
│   ├── utils/              
│   ├── auth/               
│   └── api-client/         
```
**Herramientas:** Turborepo o Nx

### 2. Nivel App: Organización Interna (DDD)

**Dentro de cada app (ej: `apps/admin/src/`):**
```
src/
├── domains/               # Lógica de negocio
│   ├── users/
│   │   ├── components/   
│   │   ├── hooks/        
│   │   └── store/        
│   └── products/
├── shared/                # Componentes locales de la app
└── core/                  # Routing, config
```

### 3. Integración Entre Apps

**Opción A: Route-based (Simple):**
```typescript
// Shell principal que carga apps
<Route path="/admin/*" component={lazy(() => import('@apps/admin'))} />
<Route path="/customers/*" component={lazy(() => import('@apps/customers'))} />
```

**Opción B: Module Federation (Avanzado):**
- Apps comparten módulos en runtime
- Mayor flexibilidad pero más complejo

### 4. Gobernanza (Capa Transversal)

**Design System compartido:**
- Package `@company/ui` con componentes comunes
- Storybook para documentación
- Tokens de diseño centralizados

**Estándares:**
- ESLint + Prettier compartido
- TypeScript strict
- Husky + lint-staged para commits
- CI/CD pipeline por app

### 5. Comunicación y Deploy

**State y eventos:**
```typescript
// Estado local por app, eventos para comunicación cross-app
events.emit('user:updated', userData);
```

**Deploy independiente:**
- Cada equipo despliega su app sin afectar otras
- Versionado de packages compartidos con Changesets

## Resumen Visual

```
┌─────────────────────────────────────────┐
│          MONOREPO (Turborepo)           │
├─────────────────────────────────────────┤
│  Apps (cada equipo)     Packages (shared)
│  ├─ admin/              ├─ @company/ui  │
│  │  └─ src/             ├─ @company/auth│
│  │     └─ domains/      └─ @company/api │
│  │        ├─ users/                      │
│  │        └─ products/                   │
│  ├─ customers/                           │
│  └─ analytics/                           │
│                                          │
│  Deploy independiente ↓  ↓  ↓           │
└─────────────────────────────────────────┘
```

## Beneficios

✅ **Autonomía:** Cada equipo trabaja en su app  
✅ **Reutilización:** Packages compartidos evitan duplicación  
✅ **Escalabilidad:** Agregar equipos sin conflictos  
✅ **Deploy independiente:** Sin bloqueos entre equipos  
✅ **Consistencia:** Design system unificado

---

### Pregunta 8: Clean Architecture en Frontend

## Solución Concreta: Caso de Módulo de Productos

### Principios de Clean Architecture Aplicados

**1. Separación por capas (Dependency Rule)**
```
┌────────────────────────────────────────┐
│   Presentation Layer (UI)              │ ← Componentes React
├────────────────────────────────────────┤
│   Application Layer (Use Cases)       │ ← Lógica de negocio
├────────────────────────────────────────┤
│   Domain Layer (Entities)              │ ← Modelos de dominio
├────────────────────────────────────────┤
│   Infrastructure Layer (API/Storage)   │ ← Detalles de implementación
└────────────────────────────────────────┘
```

### Estructura de Carpetas

```
src/modules/products/
├── domain/
│   ├── entities/
│   │   └── Product.ts              # Modelo puro
│   └── repositories/
│       └── ProductRepository.ts     # Interface (contrato)
├── application/
│   └── use-cases/
│       ├── GetProducts.ts           # Caso de uso
│       ├── CreateProduct.ts
│       └── UpdateProduct.ts
├── infrastructure/
│   ├── api/
│   │   └── ProductApiRepository.ts  # Implementación HTTP
│   └── persistence/
│       └── ProductLocalRepository.ts # Implementación Local Storage
└── presentation/
    ├── components/
    │   ├── ProductList.tsx          # UI Component
    │   └── ProductForm.tsx
    └── hooks/
        └── useProducts.ts            # Hook que usa use cases
```

### Implementación

**1. Domain Layer (Entidad + Interface):**
```typescript
// domain/entities/Product.ts
export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number,
    public stock: number
  ) {
    this.validate();
  }
  
  private validate() {
    if (this.price < 0) throw new Error('Precio no puede ser negativo');
    if (this.stock < 0) throw new Error('Stock no puede ser negativo');
  }
  
  hasStock(): boolean {
    return this.stock > 0;
  }
}

// domain/repositories/ProductRepository.ts
export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}
```

**2. Application Layer (Use Cases):**
```typescript
// application/use-cases/GetProducts.ts
export class GetProducts {
  constructor(private repository: ProductRepository) {}
  
  async execute(filters?: { minPrice?: number }): Promise<Product[]> {
    const products = await this.repository.getAll();
    
    // Lógica de negocio aquí
    if (filters?.minPrice) {
      return products.filter(p => p.price >= filters.minPrice);
    }
    
    return products;
  }
}

// application/use-cases/CreateProduct.ts
export class CreateProduct {
  constructor(private repository: ProductRepository) {}
  
  async execute(data: { name: string; price: number; stock: number }): Promise<Product> {
    // Validaciones de negocio
    const product = new Product(generateId(), data.name, data.price, data.stock);
    return await this.repository.create(product);
  }
}
```

**3. Infrastructure Layer (Implementación):**
```typescript
// infrastructure/api/ProductApiRepository.ts
export class ProductApiRepository implements ProductRepository {
  constructor(private httpClient: HttpClient) {}
  
  async getAll(): Promise<Product[]> {
    const response = await this.httpClient.get('/products');
    return response.data.map(dto => this.toDomain(dto));
  }
  
  async create(product: Product): Promise<Product> {
    const dto = this.toDto(product);
    const response = await this.httpClient.post('/products', dto);
    return this.toDomain(response.data);
  }
  
  // Mappers entre DTO y Dominio
  private toDomain(dto: any): Product {
    return new Product(dto.id, dto.name, dto.price, dto.stock);
  }
  
  private toDto(product: Product) {
    return { id: product.id, name: product.name, price: product.price, stock: product.stock };
  }
  
  // ... otros métodos
}
```

**4. Presentation Layer (UI):**
```typescript
// presentation/hooks/useProducts.ts
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dependency Injection
  const repository = useMemo(() => new ProductApiRepository(httpClient), []);
  const getProductsUseCase = useMemo(() => new GetProducts(repository), [repository]);
  const createProductUseCase = useMemo(() => new CreateProduct(repository), [repository]);
  
  const fetchProducts = async (filters?: { minPrice?: number }) => {
    setLoading(true);
    try {
      const result = await getProductsUseCase.execute(filters);
      setProducts(result);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };
  
  const createProduct = async (data: CreateProductDto) => {
    try {
      await createProductUseCase.execute(data);
      await fetchProducts();
      toast.success('Producto creado');
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return { products, loading, fetchProducts, createProduct };
}

// presentation/components/ProductList.tsx
export function ProductList() {
  const { products, loading, fetchProducts } = useProducts();
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  if (loading) return <Spinner />;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Ventajas de esta Arquitectura

✅ **Testeable:** Use cases se testean sin UI ni API  
✅ **Flexible:** Cambiar de API a GraphQL solo afecta Infrastructure  
✅ **Independiente:** UI no conoce detalles de implementación  
✅ **Mantenible:** Responsabilidades bien separadas  
✅ **Reutilizable:** Use cases se pueden usar en diferentes UI

## Ejemplo de Test

```typescript
describe('CreateProduct Use Case', () => {
  it('should create a product with valid data', async () => {
    // Mock del repository
    const mockRepo: ProductRepository = {
      create: jest.fn().mockResolvedValue(new Product('1', 'Test', 100, 10))
    };
    
    const useCase = new CreateProduct(mockRepo);
    const result = await useCase.execute({ name: 'Test', price: 100, stock: 10 });
    
    expect(result.name).toBe('Test');
    expect(mockRepo.create).toHaveBeenCalled();
  });
  
  it('should throw error with negative price', async () => {
    const mockRepo: ProductRepository = { create: jest.fn() };
    const useCase = new CreateProduct(mockRepo);
    
    await expect(
      useCase.execute({ name: 'Test', price: -10, stock: 10 })
    ).rejects.toThrow('Precio no puede ser negativo');
  });
});
```

---

### Pregunta 9: Acceso a Cookie con httpOnly:true

## ⚠️ Punto Clave: NO es posible acceder desde el frontend

**Configuración actual:**
```javascript
{
  secure: true,      // Solo HTTPS
  sameSite: 'lax',   // Protección CSRF
  maxAge: 1000*60*15, // 15 minutos
  httpOnly: true     // ❌ BLOQUEA acceso desde JavaScript
}
```

**`httpOnly: true` significa que:**
- La cookie es **inaccesible desde `document.cookie`**
- Solo el navegador la envía automáticamente al servidor
- Es una **medida de seguridad contra XSS** (correcto diseño)

```javascript
// ❌ ESTO NO FUNCIONA con httpOnly: true
const token = document.cookie.split('token=')[1]; // Undefined
```

---

## Solución Correcta: Endpoint del Backend

### Approach 1: Endpoint `/api/me` (Recomendado)

**Backend:**
```javascript
// El servidor lee la cookie httpOnly y devuelve la info
app.get('/api/me', (req, res) => {
  const token = req.cookies.sessionToken; // Solo el servidor puede leer
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});
```

**Frontend:**
```typescript
// Hook para obtener usuario actual
function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/me', { credentials: 'include' }) // Envía cookies automáticamente
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .finally(() => setLoading(false));
  }, []);
  
  return { user, loading, isAuthenticated: !!user };
}

// Uso en componente
function Header() {
  const { user, loading } = useCurrentUser();
  
  if (loading) return <Spinner />;
  
  return (
    <nav>
      <span>Bienvenido, {user?.name}</span>
      <span>Role: {user?.role}</span>
    </nav>
  );
}
```

### Approach 2: Dual Token (Access + Info)

Si necesitas datos del usuario sin llamar al backend constantemente:

**Backend al hacer login:**
```javascript
app.post('/api/login', async (req, res) => {
  const user = await authenticate(req.body);
  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET);
  
  // Cookie httpOnly con el token seguro (para auth)
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15
  });
  
  // Cookie legible para info no sensible (SIN httpOnly)
  res.cookie('userInfo', JSON.stringify({
    name: user.name,
    avatar: user.avatar
  }), {
    httpOnly: false, // ✅ Frontend puede leer
    secure: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15
  });
  
  res.json({ success: true });
});
```

**Frontend:**
```typescript
function getUserInfo() {
  const match = document.cookie.match(/userInfo=([^;]+)/);
  if (match) {
    return JSON.parse(decodeURIComponent(match[1]));
  }
  return null;
}

// Uso
const user = getUserInfo();
console.log(user.name, user.avatar);
```

---

## Resumen

| Approach | Pros | Contras |
|----------|------|---------|
| **Endpoint `/api/me`** | ✅ Más seguro, info siempre actualizada | Requiere request al servidor |
| **Dual Token** | ✅ Sin request extra para info básica | Info puede quedar desactualizada |

## Recomendación

**Usar Approach 1 (endpoint `/api/me`)** porque:
- Mantiene la seguridad de `httpOnly`
- Info siempre sincronizada con el servidor
- Evita duplicar datos en cookies
- Cache con SWR/React Query para evitar requests repetidos:

```typescript
function useCurrentUser() {
  return useQuery('currentUser', 
    () => fetch('/api/me', { credentials: 'include' }).then(r => r.json()),
    { staleTime: 1000 * 60 * 5 } // Cache 5 min
  );
}
```

---

### Pregunta 10: Idempotencia en Acciones del Usuario en React

## ¿Qué es Idempotencia?

> Una operación es **idempotente** si ejecutarla múltiples veces produce el mismo resultado que ejecutarla una sola vez.

**Problema común:** Usuario hace doble clic en "Comprar" → se crean 2 pedidos.

---

## Estrategias de Implementación

### 1. Deshabilitar Botón Durante Proceso

```typescript
function SubmitButton({ onClick, children }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleClick = async () => {
    if (isSubmitting) return; // Previene doble ejecución
    
    setIsSubmitting(true);
    try {
      await onClick();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <button onClick={handleClick} disabled={isSubmitting}>
      {isSubmitting ? 'Procesando...' : children}
    </button>
  );
}
```

### 2. Idempotency Key (Backend + Frontend)

```typescript
// Frontend: Genera key única por intención
import { v4 as uuid } from 'uuid';

function useIdempotentMutation() {
  const idempotencyKeyRef = useRef<string | null>(null);
  
  const execute = async (action: () => Promise<any>) => {
    // Genera key solo la primera vez
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = uuid();
    }
    
    return await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKeyRef.current
      },
      body: JSON.stringify(data)
    });
  };
  
  const reset = () => {
    idempotencyKeyRef.current = null; // Nueva acción, nueva key
  };
  
  return { execute, reset };
}

// Backend: Verifica key antes de procesar
app.post('/api/orders', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];
  
  // Verificar si ya se procesó
  const existing = await redis.get(`idempotency:${idempotencyKey}`);
  if (existing) {
    return res.json(JSON.parse(existing)); // Retorna resultado anterior
  }
  
  // Procesar nueva orden
  const order = await createOrder(req.body);
  
  // Guardar resultado con TTL (24h)
  await redis.setex(`idempotency:${idempotencyKey}`, 86400, JSON.stringify(order));
  
  res.json(order);
});
```

### 3. React Query / SWR con Deduplicación

```typescript
function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => api.createOrder(data),
    // Previene múltiples llamadas simultáneas con la misma key
    mutationKey: ['createOrder'],
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    }
  });
}

// Uso
function CheckoutButton() {
  const { mutate, isLoading } = useCreateOrder();
  
  return (
    <button 
      onClick={() => mutate(orderData)} 
      disabled={isLoading}
    >
      {isLoading ? 'Procesando...' : 'Confirmar Compra'}
    </button>
  );
}
```

### 4. Debounce para Acciones Rápidas

```typescript
import { useDebouncedCallback } from 'use-debounce';

function SearchInput() {
  const [query, setQuery] = useState('');
  
  // Solo ejecuta después de 300ms sin nuevas llamadas
  const debouncedSearch = useDebouncedCallback(
    async (value) => {
      await api.search(value);
    },
    300
  );
  
  return (
    <input 
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

### 5. Throttle para Acciones Frecuentes

```typescript
import { useThrottledCallback } from 'use-debounce';

function LikeButton({ postId }) {
  // Máximo 1 llamada cada 1 segundo
  const throttledLike = useThrottledCallback(
    () => api.likePost(postId),
    1000
  );
  
  return <button onClick={throttledLike}>👍</button>;
}
```

### 6. Optimistic Updates con Rollback

```typescript
function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId) => api.toggleFavorite(productId),
    onMutate: async (productId) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries(['favorites']);
      
      // Snapshot del estado anterior
      const previous = queryClient.getQueryData(['favorites']);
      
      // Actualización optimista
      queryClient.setQueryData(['favorites'], (old) => 
        old.includes(productId) 
          ? old.filter(id => id !== productId)
          : [...old, productId]
      );
      
      return { previous };
    },
    onError: (err, productId, context) => {
      // Rollback si falla
      queryClient.setQueryData(['favorites'], context.previous);
    }
  });
}
```

---

## Resumen de Técnicas

| Técnica | Cuándo Usar | Nivel |
|---------|-------------|-------|
| **Deshabilitar botón** | Siempre como baseline | Frontend |
| **Idempotency Key** | Transacciones críticas (pagos, órdenes) | Frontend + Backend |
| **React Query/SWR** | Mutaciones con deduplicación automática | Frontend |
| **Debounce** | Búsquedas, autoguardado | Frontend |
| **Throttle** | Likes, scrolls, eventos frecuentes | Frontend |
| **Optimistic + Rollback** | UX rápida con resiliencia | Frontend |

## Recomendación

Para operaciones críticas (pagos, órdenes), combinar:

```typescript
// ✅ Approach completo
function PurchaseButton() {
  const [idempotencyKey] = useState(() => uuid()); // Key única por render
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePurchase = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await api.purchase({
        headers: { 'Idempotency-Key': idempotencyKey },
        body: cartData
      });
      toast.success('Compra exitosa');
    } catch (error) {
      toast.error('Error en la compra');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <button onClick={handlePurchase} disabled={isSubmitting}>
      {isSubmitting ? 'Procesando...' : 'Comprar'}
    </button>
  );
}
```


