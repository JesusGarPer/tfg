import { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  name: string;
  options: string[];
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  getImage?: (name: string) => string | undefined;
  defaultImage?: string;
}

export default function SearchableSelect({ name, options, placeholder, value, onChange, getImage, defaultImage }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtramos las opciones para que coincida si el inicio del nombre o de cualquiera de sus palabras coincide con la búsqueda
  const searchLower = search.toLowerCase();
  const filteredOptions = options.filter(opt => {
    const optLower = opt.toLowerCase();
    return optLower.startsWith(searchLower) || optLower.split(' ').some(word => word.startsWith(searchLower));
  });

  // Cerramos el menú si el usuario hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOfficialValue = options.includes(value);
  const selectedImage = (getImage && value && isOfficialValue) ? getImage(value) : undefined;

  return (
    <div className={`relative w-full text-sm ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      {/* Input oculto para que el FormData lo envíe al backend */}
      <input type="hidden" name={name} value={value} />

      {/* Botón visible que actúa como el "Select" */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-300 dark:bg-[#0A0D14] border border-gray-200 dark:border-gray-800 rounded cursor-pointer pl-1 pr-2 py-2 text-base text-gray-800 dark:text-gray-300 h-[50px] flex items-center justify-between focus:outline-none focus:border-cyan-500/50 transition-colors"
      >
        <div className="flex items-center gap-1 w-full overflow-hidden">
          {getImage && (
            selectedImage ? (
              <img src={selectedImage} alt={value} className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
            ) : value ? (
              defaultImage ? (
                <img src={defaultImage} alt="Default" className="w-10 h-10 rounded-full object-cover bg-gray-300 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-inner flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-inner flex items-center justify-center text-gray-500 text-xs font-bold uppercase flex-shrink-0">
                {value.charAt(0)}
                </div>
              )
            ) : null
          )}
          <span className={`truncate text-left ${value ? '' : 'text-gray-500 ml-1'}`}>
            {value || placeholder}
          </span>
        </div>
        <span className="text-[10px] text-gray-500 flex-shrink-0 ml-1">▼</span>
      </button>

      {/* Menú desplegable flotante */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-100 dark:bg-[#0F121C] border border-gray-300 dark:border-gray-700 rounded-md shadow-xl overflow-hidden">
          {/* Buscador */}
          <div className="p-2 border-b border-gray-300 dark:border-gray-800 bg-gray-200 dark:bg-[#0A0D14]">
            <input
              type="text"
              autoFocus
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full bg-white dark:bg-[#151923] border border-gray-300 dark:border-gray-700 rounded p-1.5 text-xs text-gray-800 dark:text-white outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Lista de opciones filtradas */}
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isOfficialOption = options.includes(option);
                const imgUrl = (getImage && isOfficialOption) ? getImage(option) : undefined;
                return (
                  <li
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`flex items-center gap-2 px-2 py-3 text-sm cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors ${value === option ? 'bg-cyan-900/20 text-cyan-400' : 'text-gray-700 dark:text-gray-300'}`}                  >
                    {getImage && (
                        imgUrl ? (
                            <img src={imgUrl} alt={option} className="w-9 h-9 rounded-full object-cover bg-gray-200 dark:bg-gray-800" />
                        ) : (
                            defaultImage ? (
                              <img src={defaultImage} alt="Default" className="w-9 h-9 rounded-full object-cover bg-gray-300 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-inner flex-shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-inner flex items-center justify-center text-gray-500 text-[10px] font-bold uppercase flex-shrink-0">
                                {option.charAt(0)}
                              </div>
                            )
                        )
                    )}
                    <span className="flex-1 min-w-0 break-words leading-tight">{option}</span>
                  </li>
                );
              })
            ) : null}

            {/* Opción para añadir valor personalizado si no hay coincidencia exacta */}
            {search.trim() !== '' && !options.some(opt => opt.toLowerCase() === search.trim().toLowerCase()) && (
               <li
                 onClick={() => {
                   onChange(search.trim());
                   setIsOpen(false);
                   setSearch('');
                 }}
                 className="flex items-center gap-2 px-2 py-3 text-sm cursor-pointer hover:bg-cyan-900/20 transition-colors text-cyan-500 border-t border-gray-300 dark:border-gray-700"
               >
                 {getImage && (
                   <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-inner flex items-center justify-center text-cyan-500 text-lg flex-shrink-0">+</div>
                 )}
                 <span className="flex-1 min-w-0 break-words leading-tight">Usar personalizado: <strong>"{search.trim()}"</strong></span>
               </li>
            )}

            {filteredOptions.length === 0 && search.trim() === '' && (
              <li className="px-3 py-4 text-xs text-center text-gray-500">No hay resultados</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
