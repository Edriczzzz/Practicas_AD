import { useEffect, useState } from "react";

interface Usuario {
  id: number;
  name: string;
  email: string;
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        setCargando(true);
        setError(null);

        const respuesta = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!respuesta.ok) {
          throw new Error("Error al obtener los usuarios");
        }

        const datos: Usuario[] = await respuesta.json();
        setUsuarios(datos);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarUsuarios();
  }, []);

  if (cargando) return <p>Cargando usuarios...</p>;
  if (error) return <p>Ocurrió un error: {error}</p>;

  return (
    <div>
      <h1>Usuarios (desde API)</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            <strong>{usuario.name}</strong> — {usuario.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
