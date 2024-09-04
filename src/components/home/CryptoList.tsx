import React, { useState } from "react";
import TradingViewWidget from "./TradingViewWidget";
import { formatKoreanNumber } from "@/pages/home";
import clsx from "clsx";

interface CryptoData {
  market: string;
  koreanName: string;
  englishName: string;
  tradePrice: string;
  kimchiPremium?: number;
  change: string;
  changePrice: string;
  changeRate: number;
  accTradePrice24h: number;
}

interface CryptoListProps {
  selected: string;
  data: CryptoData[];
}

// market을 BTCKRW 형식으로 변환하는 함수
const transformMarketSymbol = (market: string) => {
  const [currency, asset] = market.split("-");
  return `${asset}${currency}`;
};

const CryptoList: React.FC<CryptoListProps> = ({ selected, data }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleRowClick = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div>
      <div className="flex justify-between p-2 px-4 border-b border-purple-100 text-sm text-bold">
        <div className="w-2/6 text-left">한글명</div>
        <div className="w-1/6 text-right">현재가</div>
        <div
          className={clsx(
            "w-1/6 text-right ",
            selected === "KRW" ? "block" : "hidden"
          )}
        >
          김프
        </div>
        <div className="w-1/6 text-right">전일대비</div>
        <div className="w-1/6 text-right">거래대금</div>
      </div>
      {data.map((item, index) => {
        console.log(item);
        return (
          <div key={index}>
            <div
              className="flex justify-between p-2 px-4 border-b border-purple-100 text-xs cursor-pointer"
              onClick={() => handleRowClick(index)}
            >
              <div className="w-2/6 text-left">
                <div>{item.koreanName}</div>
                <div className="text-contrast-200">{item.market}</div>
              </div>
              <div className="w-1/6 text-right">
                {item.tradePrice.toLocaleString()}
              </div>
              {/* 김프 정보 (퍼센트 + 금액) */}
              {selected === "KRW" && (
                <div className="w-1/6 text-right text-contrast-200">
                  {item.kimchiPremium && (
                    <div>
                      {item.kimchiPremium > 0 ? (
                        <div className="text-red">
                          +{item.kimchiPremium.toFixed(2)}%
                        </div>
                      ) : (
                        <div className="text-blue">
                          {item.kimchiPremium.toFixed(2)}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* 전일대비 정보 (퍼센트 + 금액) */}
              <div className="w-1/6 text-right text-contrast-200">
                {item.changeRate === 0 ? (
                  <div>
                    <div>0%</div>
                    <div>0</div>
                  </div>
                ) : (
                  <div>
                    {item.changeRate > 0 ? (
                      <div>
                        <div className="text-red">
                          +{item.changeRate.toFixed(2)}%
                        </div>
                        <div>+{item.changePrice.toLocaleString()}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-blue">
                          {item.changeRate.toFixed(2)}%
                        </div>
                        <div>{item.changePrice.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-1/6 text-right">
                {formatKoreanNumber(item.accTradePrice24h)}
              </div>
            </div>
            {/* 토글된 경우에만 차트 표시 */}
            {selectedIndex === index && (
              <div className="p-2 border-b border-purple-100 bg-purple-700 text-xs text-gray-300 h-[300px]">
                <TradingViewWidget
                  symbol={transformMarketSymbol(item.market)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CryptoList;
