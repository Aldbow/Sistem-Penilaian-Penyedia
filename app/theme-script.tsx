export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var storageKey = 'kemnaker-theme';
              var theme = localStorage.getItem(storageKey);
              var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              
              // Determine the actual theme to apply
              var appliedTheme = theme || 'light';
              if (theme === 'system') {
                appliedTheme = systemTheme;
              }
              
              // Apply theme immediately to prevent flickering
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(appliedTheme);
              
              // Set attribute for CSS targeting
              document.documentElement.setAttribute('data-theme', appliedTheme);
            } catch (e) {
              // Fallback to light theme if localStorage fails
              document.documentElement.classList.add('light');
              document.documentElement.setAttribute('data-theme', 'light');
            }
          })();
        `,
      }}
    />
  );
}
