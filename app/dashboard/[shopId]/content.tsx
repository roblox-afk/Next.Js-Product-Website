"use client"
import { setShopPassword, setShopStatus, storeData } from "@/Actions/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Divider, ScrollShadow, Switch} from "@nextui-org/react"
import { Card, ConfigProvider, Statistic } from "antd";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ShopDashboardContent = ({params, shopData}: {params: {shopId: string}, shopData: storeData}) => {
    const [isSelected, setIsSelected] = useState(shopData.published)
    const [newStorePass, setNewStorePass] = useState(shopData.password)
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorTextHeading: "#fff",
                    colorBorderBg:"#52525b",
                    colorInfoBorder: "#000"
                }
            }}
        >
            <ScrollShadow hideScrollBar className="w-[100%]">
                <div className="h-fit w-full flex flex-row space-x-4 mt-10 mx-10">
                    <Card bordered={false} title="Visits" className="bg-default-50 w-60 border-default-300 h-fit" style={{ borderColor: "#52525b" }}>
                        <Statistic
                            className=""
                            value={75.5}
                            precision={2}
                            valueStyle={{ color: '#17c964' }}
                            prefix={<ArrowUp />}
                            suffix="%"
                        />
                    </Card>
                    <Card bordered={false} classNames={{ header: "border-default-300", title: "border-default-300" }} title="Profits" className="h-fit bg-default-50 w-60 border-default-300" style={{ borderColor: "#52525b" }}>
                        <Statistic
                            className=""
                            value={20.4}
                            precision={2}
                            valueStyle={{ color: '#f31260' }}
                            prefix={<ArrowDown />}
                            suffix="%"
                        />
                    </Card>
                    <Card bordered={false} title="Shop Info" className="bg-default-50 w-60 border-default-300 h-fit" style={{ borderColor: "#52525b" }}>
                        <Switch color="success" isSelected={isSelected} onValueChange={(newStatus) => {
                            setIsSelected(newStatus)
                            setShopStatus(params.shopId, newStatus)
                        }}>
                            Published
                        </Switch>
                        <Input className="border-default-300 mt-2 text-white" onChangeCapture={(e) => setNewStorePass(e.currentTarget.value)} placeholder="Enter a new password" />
                        <Button variant="outline" className="w-28 border-default-300 hover:bg-default-300 text-white mt-2" onClick={() => setShopPassword(params.shopId, newStorePass)}>Save password</Button>
                    </Card>
                </div>
            </ScrollShadow>
        </ConfigProvider>
    )
}
export default ShopDashboardContent;