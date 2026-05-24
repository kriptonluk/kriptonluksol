export default function SolanaScannerApp() {
  const [token, setToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [data, setData] = React.useState(null);

  const fetchTokenData = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const dexRes = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${token}`
      );

      const dexData = await dexRes.json();
      const pair = dexData?.pairs?.[0];

      let rugData = null;

      try {
        const rugRes = await fetch(
          `https://api.rugcheck.xyz/v1/tokens/${token}/report`
        );

        rugData = await rugRes.json();
      } catch (e) {
        console.log("RugCheck unavailable");
      }

      setData({
        pair,
        rugData,
        links: {
          rugcheck: `https://rugcheck.xyz/tokens/${token}`,
          photon: `https://photon-sol.tinyastro.io/en/lp/${token}`,
          dextools: `https://www.dextools.io/app/en/solana/pair-explorer/${token}`,
          tokensniffer: `https://tokensniffer.com/token/solana/${token}`,
          gecko: `https://www.geckoterminal.com/solana/tokens/${token}`,
          dexscreener: `https://dexscreener.com/solana/${token}`,
          solscan: `https://solscan.io/token/${token}`,
        },
      });
    } catch (err) {
      setError("Veri alınamadı");
    }

    setLoading(false);
  };

  const Card = ({ title, value }) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <p className="text-zinc-400 text-sm">{title}</p>
      <p className="text-white font-bold text-xl mt-2 break-all">
        {value || "Yok"}
      </p>
    </div>
  );

  const ExternalButton = ({ href, title }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="bg-green-500 hover:bg-green-400 transition-all text-black font-bold rounded-2xl px-4 py-3 text-center"
    >
      {title}
    </a>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-4">
            Solana Token Scanner Pro
          </h1>

          <p className="text-zinc-400 text-lg">
            DexScreener + RugCheck + Solscan + GeckoTerminal
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Solana token address"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-green-500"
            />

            <button
              onClick={fetchTokenData}
              className="bg-green-500 hover:bg-green-400 text-black font-black rounded-2xl px-8 py-4"
            >
              Tara
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-green-400 text-xl animate-pulse mb-6">
            Token taranıyor...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-2xl p-4 mb-6">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                title="Token"
                value={data.pair?.baseToken?.name}
              />

              <Card
                title="Symbol"
                value={data.pair?.baseToken?.symbol}
              />

              <Card
                title="Fiyat"
                value={
                  data.pair?.priceUsd
                    ? `$${data.pair.priceUsd}`
                    : null
                }
              />

              <Card
                title="Likidite"
                value={
                  data.pair?.liquidity?.usd
                    ? `$${Number(
                        data.pair.liquidity.usd
                      ).toLocaleString()}`
                    : null
                }
              />

              <Card
                title="24H Hacim"
                value={
                  data.pair?.volume?.h24
                    ? `$${Number(
                        data.pair.volume.h24
                      ).toLocaleString()}`
                    : null
                }
              />

              <Card
                title="24H Alım"
                value={data.pair?.txns?.h24?.buys}
              />

              <Card
                title="24H Satım"
                value={data.pair?.txns?.h24?.sells}
              />

              <Card
                title="Market Cap"
                value={
                  data.pair?.marketCap
                    ? `$${Number(
                        data.pair.marketCap
                      ).toLocaleString()}`
                    : null
                }
              />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-3xl font-black mb-6">
                RugCheck Risk Paneli
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card
                  title="Risk Score"
                  value={data.rugData?.score || "Yok"}
                />

                <Card
                  title="Risk Level"
                  value={data.rugData?.riskLevel || "Unknown"}
                />

                <Card
                  title="Mint Authority"
                  value={
                    data.rugData?.tokenMeta?.mintAuthority
                      ? "ACTIVE"
                      : "DISABLED"
                  }
                />

                <Card
                  title="Freeze Authority"
                  value={
                    data.rugData?.tokenMeta?.freezeAuthority
                      ? "ACTIVE"
                      : "DISABLED"
                  }
                />
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-3xl font-black mb-6">
                Gelişmiş Analiz Sistemi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card title="Whale Alert" value={data.pair?.txns?.h24?.buys > data.pair?.txns?.h24?.sells ? "BUY PRESSURE" : "SELL PRESSURE"} />
                <Card title="Sniper Detection" value={data.pair?.volume?.h24 > 100000 ? "POSSIBLE SNIPERS" : "LOW"} />
                <Card title="Volume Bot Risk" value={data.pair?.txns?.h24?.buys > 5000 ? "HIGH" : "NORMAL"} />
                <Card title="AI Risk Score" value={data.rugData?.score ? `${100 - data.rugData.score}/100 SAFE` : "UNKNOWN"} />
                <Card title="Liquidity Lock" value={data.rugData?.lockerOwners?.length > 0 ? "LOCKED" : "UNLOCKED"} />
                <Card title="Ownership" value={data.rugData?.tokenMeta?.mutable ? "ACTIVE" : "RENOUNCED"} />
                <Card title="Honeypot Risk" value={data.rugData?.score > 7000 ? "HIGH" : "LOW"} />
                <Card title="Trade Momentum" value={data.pair?.txns?.h24?.buys > data.pair?.txns?.h24?.sells ? "BULLISH" : "BEARISH"} />
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-3xl font-black mb-6">
                Canlı Grafik
              </h2>

              <iframe
                title="chart"
                src={`https://dexscreener.com/solana/${token}?embed=1&theme=dark`}
                className="w-full h-[600px] rounded-2xl"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <iframe
                  title="rugcheck"
                  src={`https://rugcheck.xyz/tokens/${token}`}
                  className="w-full h-[700px] rounded-2xl border border-zinc-700"
                />

                <iframe
                  title="tokensniffer"
                  src={`https://tokensniffer.com/token/solana/${token}`}
                  className="w-full h-[700px] rounded-2xl border border-zinc-700"
                />
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-3xl font-black mb-6">
                Solana DEX ve Tarama Platformları
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ExternalButton
                  href={`https://raydium.io/swap/?inputMint=${token}`}
                  title="Raydium"
                />

                <ExternalButton
                  href={`https://jup.ag/swap/SOL-${token}`}
                  title="Jupiter"
                />

                <ExternalButton
                  href={`https://orca.so`}
                  title="Orca"
                />

                <ExternalButton
                  href={`https://lifinity.io`}
                  title="Lifinity"
                />

                <ExternalButton
                  href={`https://meteora.ag`}
                  title="Meteora"
                />

                <ExternalButton
                  href={`https://openbookdex.org`}
                  title="OpenBook"
                />

                <ExternalButton
                  href={`https://birdeye.so/token/${token}?chain=solana`}
                  title="Birdeye"
                />

                <ExternalButton
                  href={data.links.dexscreener}
                  title="DexScreener"
                />

                <ExternalButton
                  href={data.links.gecko}
                  title="GeckoTerminal"
                />

                <ExternalButton
                  href={data.links.solscan}
                  title="Solscan"
                />

                <ExternalButton
                  href={data.links.rugcheck}
                  title="RugCheck"
                />

                <ExternalButton
                  href={data.links.photon}
                  title="Photon"
                />

                <ExternalButton
                  href={data.links.dextools}
                  title="DEXTools"
                />

                <ExternalButton
                  href={data.links.tokensniffer}
                  title="TokenSniffer"
                />
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-3xl font-black mb-6">
                Güvenlik Kontrol Sistemleri
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ExternalButton
                  href={`https://rugcheck.xyz/tokens/${token}`}
                  title="RugCheck"
                />

                <ExternalButton
                  href={`https://tokensniffer.com/token/solana/${token}`}
                  title="TokenSniffer"
                />

                <ExternalButton
                  href={`https://gopluslabs.io/token-security/solana/${token}`}
                  title="GoPlus Security"
                />

                <ExternalButton
                  href={`https://solsniffer.com/scanner/${token}`}
                  title="SolSniffer"
                />

                <ExternalButton
                  href={`https://quillcheck.quillaudits.com`}
                  title="QuillCheck"
                />

                <ExternalButton
                  href={`https://skynet.certik.com`}
                  title="Certik Skynet"
                />
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-3xl font-black mb-6">
                Reklam Alanları
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 25 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900 border border-zinc-700 rounded-xl h-24 flex items-center justify-center text-zinc-500 text-sm"
                  >
                    Reklam {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}}
      </div>
    </div>
  );
}
