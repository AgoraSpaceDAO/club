import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import PageContent from "components/common/PageContent"
import TokenImage from "components/common/TokenImage"
import useClaim from "components/index/hooks/useClaim"
import useMerkleDistributor from "components/index/hooks/useMerkleDistributor"
import useWithdraw from "components/index/hooks/useWithdraw"
import useWithdrawAmount from "components/index/hooks/useWithdrawAmount"
import MerkleDistributor from "constants/MerkleDistributor"
import useTokenDataWithImage from "hooks/useTokenDataWithImage"
import { useEffect, useMemo, useRef, useState } from "react"
import { mutate } from "swr"

const AirdropPage = (): JSX.Element => {
  const { active, account, chainId } = useWeb3React()
  const eligible = useMemo(
    () => Object.keys(MerkleDistributor.claims).includes(account),
    [account]
  )
  const {
    isValidating: isMerkleDistributorLoading,
    data: [isClaimed, token, distributionEnd, owner],
  } = useMerkleDistributor()
  const {
    isLoading: isTokenValidating,
    tokenSymbol,
    tokenImage,
  } = useTokenDataWithImage(token)

  const ended = useMemo(
    () =>
      distributionEnd
        ? +formatUnits(distributionEnd, 0) < Math.round(new Date().getTime() / 1000)
        : true,
    [distributionEnd]
  )

  const [showClaimSuccess, setShowClaimSuccess] = useState(false)
  const onClose = () => setShowClaimSuccess(false)
  const cancelRef = useRef()

  const {
    onSubmit: onClaimSubmit,
    isLoading: isClaimLoading,
    response: claimResponse,
  } = useClaim()

  useEffect(() => {
    if (claimResponse) setShowClaimSuccess(true)
  }, [claimResponse])

  const {
    onSubmit: onWithdrawSubmit,
    isLoading: isWithdrawLoading,
    response: withdrawResponse,
  } = useWithdraw()

  useEffect(() => {
    if (withdrawResponse) mutate(active ? ["merkle", chainId, account] : null)
  }, [withdrawResponse])

  const { data: withdrawAmount } = useWithdrawAmount()
  const canWithdraw = useMemo(
    () => parseFloat(withdrawAmount) > 0,
    [withdrawAmount, withdrawResponse]
  )

  return (
    <PageContent
      layoutTitle="CLUBdrop"
      title="CLUBdrop"
      header={
        account &&
        !isMerkleDistributorLoading &&
        (tokenImage || tokenSymbol) && (
          <TokenImage
            isLoading={isTokenValidating}
            tokenSymbol={tokenSymbol}
            tokenImage={tokenImage}
          />
        )
      }
    >
      {account && !tokenSymbol && (
        <>
          {isMerkleDistributorLoading ? (
            <Spinner mx="auto" />
          ) : (
            <Text fontSize="lg">Could not fetch reward token.</Text>
          )}
        </>
      )}

      {account && tokenSymbol && (
        <>
          <VStack spacing={1} fontSize="xl" pb={4}>
            {isClaimed ? (
              <Text fontSize="xl">You've already claimed your tokens!</Text>
            ) : (
              <>
                {!ended && eligible && (
                  <>
                    <Text>
                      {`Congrats! You've qualified to receive ${tokenSymbol}.`}
                    </Text>
                    <Text>
                      Read{" "}
                      <Link href="" target="_blank" color="seedclub.green.700">
                        this post
                      </Link>{" "}
                      to learn more about what's next.
                    </Text>
                  </>
                )}

                {!ended && !eligible && (
                  <>
                    <Text>Sorry! You didn't qualify for the CLUBDrop.</Text>
                    <Text>
                      Read{" "}
                      <Link href="" target="_blank" color="seedclub.green.700">
                        this post
                      </Link>{" "}
                      to learn why and how to get involved moving forward.
                    </Text>
                  </>
                )}

                {ended && <Text>Sorry! Claiming period has ended.</Text>}
              </>
            )}
          </VStack>

          {ended && owner && owner?.toLowerCase() === account?.toLowerCase() && (
            <Button
              px={8}
              letterSpacing="wide"
              colorScheme="seedclub"
              isDisabled={!canWithdraw}
              isLoading={isWithdrawLoading}
              loadingText="Withdraw"
              onClick={onWithdrawSubmit}
            >
              Withdraw unclaimed tokens
            </Button>
          )}

          {!ended && eligible && owner?.toLowerCase() !== account?.toLowerCase() && (
            <Button
              px={8}
              letterSpacing="wide"
              colorScheme="seedclub"
              isDisabled={isClaimed}
              isLoading={isClaimLoading}
              loadingText="Claiming"
              onClick={onClaimSubmit}
            >
              Claim
            </Button>
          )}
        </>
      )}

      {!account && (
        <Text fontSize="xl">Please connect your wallet in order to continue!</Text>
      )}

      <AlertDialog
        isOpen={showClaimSuccess}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="3xl" fontWeight="bold">
              Congrats!
            </AlertDialogHeader>

            <AlertDialogBody>
              You've successfully claimed your tokens!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="seedclub"
                ref={cancelRef}
                onClick={onClose}
                fontFamily="display"
              >
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </PageContent>
  )
}

export default AirdropPage
