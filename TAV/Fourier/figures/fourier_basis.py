import numpy as np
import matplotlib as mpl
from  matplotlib import pyplot as plt

COLOR = 'white'

mpl.rcParams['savefig.transparent'] = 'True'
plt.rcParams['figure.facecolor']='black'

mpl.rcParams['text.color'] = COLOR
mpl.rcParams['axes.labelcolor'] = COLOR
mpl.rcParams['axes.edgecolor'] = COLOR
mpl.rcParams['xtick.color'] = COLOR
mpl.rcParams['ytick.color'] = COLOR

N = 4

canonical_basis = np.eye(N)

plt.figure(figsize=(16, 9))
plt.suptitle("Vecteurs de la base canonique de $\mathbb{C}^4$", fontsize='xx-large')
for i in range(N):
	plt.subplot(2,2,i+1)
	plt.xticks(range(N))
	plt.yticks([0, 1])
	plt.title(f'$t_{i}$', fontsize="xx-large")
	plt.stem(canonical_basis[i])

plt.tight_layout()
plt.subplots_adjust(top=0.85)
plt.savefig('time_basis.png', dpi=300)
plt.show()


m = 20
dft_basis = np.array([[np.exp(1j * 2 * np.pi * k / N * n ) for n in range(N)] for k in range(N)])
dft_basis_e = np.array([[np.exp(1j * 2 * np.pi * k / N * (n/m) ) for n in range((N-1)*m + 1)] for k in range(N)])

plt.figure(figsize=(16, 9))
plt.suptitle("Vecteurs de la base de Fourier de $\mathbb{C}^4$", fontsize='xx-large')
for i in range(N):
	plt.subplot(4,2,2*i + 1)
	plt.xticks(range(N))
	plt.yticks([0, 1])
	plt.title(f'$\Re(f_{i})$', fontsize="xx-large")
	plt.plot(np.linspace(0, N - 1, (N-1)*m + 1), np.real(dft_basis_e[i]), 'o', markersize=2)
	plt.stem(np.linspace(0, N - 1, N), np.real(dft_basis[i]))

	plt.subplot(4,2,2*i + 2)
	plt.xticks(range(N))
	plt.yticks([0, 1])
	plt.title(f'$\Im(f_{i})$', fontsize="xx-large")
	plt.plot(np.linspace(0, N - 1, (N-1)*m + 1), np.imag(dft_basis_e[i]), 'o', markersize=2)
	plt.stem(np.imag(dft_basis[i]))

plt.tight_layout()
plt.subplots_adjust(top=0.85)
plt.savefig('fourier_basis.png', dpi=300)
plt.show()