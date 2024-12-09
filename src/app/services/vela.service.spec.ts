import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VelaService, Vela } from './vela.service';

describe('VelaService', () => {
  let service: VelaService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:9090/api/velas';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VelaService],
    });
    service = TestBed.inject(VelaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes HTTP pendientes
  });

  it('debería obtener todas las velas', () => {
    const mockVelas: Vela[] = [
      { id: '1', nombre: 'Vela Roja', precio: 15000, imagen: 'img1.jpg' },
      { id: '2', nombre: 'Vela Azul', precio: 20000, imagen: 'img2.jpg' },
    ];

    service.getVelas().subscribe((velas) => {
      expect(velas.length).toBe(2);
      expect(velas).toEqual(mockVelas);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockVelas);
  });

  it('debería obtener una vela por ID', () => {
    const mockVela: Vela = { id: '1', nombre: 'Vela Roja', precio: 15000, imagen: 'img1.jpg' };

    service.getVela('1').subscribe((vela) => {
      expect(vela).toEqual(mockVela);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVela);
  });

  it('debería agregar una nueva vela', () => {
    const newVela: Vela = { id: '3', nombre: 'Vela Verde', precio: 18000, imagen: 'img3.jpg' };

    service.addVela(newVela).subscribe((vela) => {
      expect(vela).toEqual(newVela);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newVela);
    req.flush(newVela);
  });

  it('debería actualizar una vela', () => {
    const updatedVela: Vela = { id: '1', nombre: 'Vela Roja Actualizada', precio: 17000, imagen: 'img1_updated.jpg' };

    service.updateVela('1', updatedVela).subscribe((vela) => {
      expect(vela).toEqual(updatedVela);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedVela);
    req.flush(updatedVela);
  });

  it('debería eliminar una vela', () => {
    service.deleteVela('1').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debería retornar el rol del usuario almacenado en localStorage', () => {
    localStorage.setItem('userRole', 'ADMIN');
    expect(service.getRole()).toBe('ADMIN');
  });

  it('debería retornar el nombre del usuario almacenado en localStorage', () => {
    localStorage.setItem('username', 'admin');
    expect(service.getUsername()).toBe('admin');
  });

  it('debería manejar el login correctamente', () => {
    const username = 'admin';
    const password = 'admin123';

    service.login(username, password);

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${btoa(`${username}:${password}`)}`);

    req.flush(null);

    expect(localStorage.getItem('userRole')).toBe('ADMIN');
    expect(localStorage.getItem('username')).toBe('admin');
  });
});
