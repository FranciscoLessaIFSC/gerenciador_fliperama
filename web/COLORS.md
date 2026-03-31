# Paleta de Cores - Gerenciador de Fliperama

## Tema Arcade Neon

A paleta de cores foi criada com inspiração em fliperamas clássicos, com tons neon vibrantes e alto contraste para melhor legibilidade e impacto visual.

### Cores Principais

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Primary** | `#FF006E` | rgb(255, 0, 110) | Botões, destaques, CTAs |
| **Secondary** | `#00D9FF` | rgb(0, 217, 255) | Inputs, borders, links |
| **Tertiary** | `#FFD500` | rgb(255, 213, 0) | Accents, alertas leves |
| **Success** | `#00FF41` | rgb(0, 255, 65) | Confirmação, status positivo |
| **Warning** | `#FF6B00` | rgb(255, 107, 0) | Avisos, atenção |
| **Error** | `#FF0055` | rgb(255, 0, 85) | Erros, status crítico |

### Cores Neutras (Background/Texto)

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Dark BG** | `#1A1A2E` | rgb(26, 26, 46) | Background principal |
| **Darker BG** | `#0F3460` | rgb(15, 52, 96) | Elementos com profundidade |
| **Accent** | `#0F3460` | rgb(15, 52, 96) | Backgrounds secundários |
| **Text** | `#FFFFFF` | rgb(255, 255, 255) | Texto principal |
| **Text Dim** | `#B0B0C0` | rgb(176, 176, 192) | Texto secundário/placeholder |

## CSS Variables

Use as variáveis CSS disponíveis no arquivo `globals.css`:

```css
:root {
  --arcade-dark-bg: #1a1a2e;
  --arcade-darker-bg: #0f3460;
  --arcade-primary: #ff006e;
  --arcade-secondary: #00d9ff;
  --arcade-tertiary: #ffd500;
  --arcade-success: #00ff41;
  --arcade-warning: #ff6b00;
  --arcade-error: #ff0055;
  --arcade-text: #ffffff;
  --arcade-text-dim: #b0b0c0;
}
```

## Uso em Componentes Mantine

### Buttons

```tsx
<Button color="arcade" variant="filled">
  Entrar
</Button>
```

### Badges

```tsx
<Badge color="arcade">Status</Badge>
```

### Inputs

```tsx
<TextInput
  placeholder="Digite algo"
  styles={{ input: { borderColor: 'var(--arcade-secondary)' } }}
/>
```

## Gradientes Recomendados

### Gradient Horizontal
```css
background: linear-gradient(
  90deg,
  #ff006e 0%,
  #00d9ff 50%,
  #ffd500 100%
);
```

### Gradient Vertical
```css
background: linear-gradient(
  135deg,
  #1a1a2e 0%,
  #0f3460 100%
);
```

## Efeitos Neon

### Glow Effect
```css
box-shadow: 
  0 0 20px rgba(255, 0, 110, 0.4),
  0 0 10px rgba(0, 217, 255, 0.2);
```

### Text Glow
```css
text-shadow: 0 0 30px rgba(255, 0, 110, 0.3);
```

## Contrast & Accessibility

- ✅ Contra elevado entre texto branco e backgrounds escuros
- ✅ Cores neon garantem visibilidade em telas e ambientes com luz
- ✅ Não depende apenas de cor para transmitir informação
- ✅ Testado para daltonismo (vermelho/verde)

## Recomendações de Uso

1. **Backgrounds**: Use `--arcade-dark-bg` ou `--arcade-darker-bg`
2. **Botões CTA**: Use gradiente de `--arcade-primary` + `--arcade-secondary`
3. **Links/Hover**: Use `--arcade-secondary` ou `--arcade-tertiary`
4. **Alertas**: Use cores específicas (success, warning, error)
5. **Texto**: Mantenha `--arcade-text` em backgrounds escuros
6. **Borders/Inputs**: Prefer `--arcade-secondary` para focus states

## Exemplo Completo

```tsx
<div style={{ 
  background: 'var(--arcade-dark-bg)',
  color: 'var(--arcade-text)'
}}>
  <button style={{
    background: 'linear-gradient(90deg, var(--arcade-primary), var(--arcade-secondary))',
    boxShadow: '0 0 20px rgba(255, 0, 110, 0.4)'
  }}>
    Clique aqui
  </button>
</div>
```
